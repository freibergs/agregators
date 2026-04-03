import re
import html
import sys
import time
import os
from selenium import webdriver
from selenium.webdriver.edge.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

URL = "https://citybee.lv/lv/pakas/"
DATA_TS_PATH = os.path.join(os.path.dirname(__file__), "app", "lib", "data.ts")

CAR_BRANDS_AND_MODELS = [
    "Model",
    "Volkswagen", "VW",
    "Toyota", "Nissan", "Seat", "MG", "Hyundai", "Kia", "Renault",
    "Peugeot", "Citroen", "Fiat", "Opel", "Skoda", "BMW", "Audi",
    "Mercedes", "Ford", "Honda", "Mazda", "Suzuki", "Dacia", "Volvo",
    "Mitsubishi", "Subaru", "Lexus", "Jeep", "Cupra", "Mini",
    # Specific models from CityBee
    "Taigo", "T-Roc", "T-Cross", "Qashqai", "Corolla", "C-HR",
    "Ateca", "ZS", "Cross",
]


def fetch_page():
    """Fetch the CityBee packages page using headless Edge."""
    opts = Options()
    opts.add_argument("--headless")
    opts.add_argument("--disable-gpu")
    opts.add_argument("--no-sandbox")

    driver = webdriver.Edge(options=opts)
    driver.get(URL)

    WebDriverWait(driver, 15).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".packages-category__content__desktop"))
    )
    time.sleep(2)

    content = driver.page_source
    driver.quit()
    return content


def extract_first_desktop_section(content):
    """Extract only the first packages-category__content__desktop div."""
    marker = 'packages-category__content__desktop'
    start = content.find(marker)
    if start == -1:
        print("ERROR: Could not find 'packages-category__content__desktop' section")
        sys.exit(1)

    start = content.rfind('<', 0, start)

    depth = 0
    i = start
    while i < len(content):
        if content[i] == '<':
            tag_end = content.find('>', i)
            if tag_end == -1:
                break
            tag = content[i:tag_end + 1]
            if re.match(r'<div[\s>]', tag, re.IGNORECASE):
                depth += 1
            elif tag.lower().startswith('</div'):
                depth -= 1
                if depth == 0:
                    return content[start:tag_end + 1]
            i = tag_end + 1
        else:
            i += 1

    next_start = content.find(marker, start + len(marker))
    if next_start != -1:
        return content[start:next_start]
    return content[start:]


def strip_html(content):
    """Strip HTML tags and clean up whitespace."""
    content = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', content, flags=re.DOTALL | re.IGNORECASE)
    content = re.sub(r'<[^>]+>', ' ', content)
    content = html.unescape(content)
    content = re.sub(r'[ \t]+', ' ', content)
    content = re.sub(r'\n\s*\n+', '\n', content)

    lines = [line.strip() for line in content.strip().split('\n')]
    lines = [line for line in lines if line]

    pattern = re.compile(
        r'\b(' + '|'.join(re.escape(b) for b in CAR_BRANDS_AND_MODELS) + r')\b',
        re.IGNORECASE
    )
    lines = [line for line in lines if not pattern.search(line)]

    # Collapse consecutive blocks of 8 identical lines into 1
    result = []
    i = 0
    while i < len(lines):
        current = lines[i]
        count = 1
        while i + count < len(lines) and lines[i + count] == current:
            count += 1
        if count >= 8 and count % 8 == 0:
            keep = count // 8
            for _ in range(keep):
                result.append(current)
        else:
            for _ in range(count):
                result.append(current)
        i += count

    return result


def parse_package_name(name_str):
    """
    Parse a package name like '30 min. + 5 km' or '1 h + 10 km' or '1 d + 50 km'
    Returns (time_minutes, distance_km, display_name) or None.
    """
    m = re.match(r'(\d+)\s*(min\.?|h|d)\s*\+\s*(\d+)\s*km', name_str)
    if not m:
        return None

    value = int(m.group(1))
    unit = m.group(2).rstrip('.')
    distance = int(m.group(3))

    if unit == 'min':
        time_minutes = value
        display_time = f'{value}min'
    elif unit == 'h':
        time_minutes = value * 60
        display_time = f'{value}h'
    elif unit == 'd':
        time_minutes = value * 1440
        display_time = f'{value}d'
    else:
        return None

    display_name = f'{display_time}+{distance}km'
    return (time_minutes, distance, display_name)


def parse_price(price_str):
    """Parse '6.89€' into a float."""
    return float(price_str.replace('€', '').replace(',', '.').strip())


def build_packages(lines):
    """
    Split lines into names and prices, pair them, and detect specials.
    Returns list of (time_minutes, distance_km, price, display_name) tuples.
    """
    # Split: first half are names, second half are prices
    name_lines = []
    price_lines = []
    for line in lines:
        if re.search(r'\d+\s*(min\.?|h|d)\s*\+\s*\d+\s*km', line):
            name_lines.append(line)
        elif re.search(r'[\d.,]+€', line):
            price_lines.append(line)

    if len(name_lines) != len(price_lines):
        print(f"WARNING: name count ({len(name_lines)}) != price count ({len(price_lines)})")
        # Use the smaller count
        count = min(len(name_lines), len(price_lines))
        name_lines = name_lines[:count]
        price_lines = price_lines[:count]

    # Detect specials: the first N entries before the sorted regular grid.
    # Regular packages start from shortest time (30 min) and go up.
    # Specials at the top are mixed/unsorted featured packages.
    num_specials = 0
    for i, name in enumerate(name_lines):
        parsed = parse_package_name(name)
        if parsed and parsed[0] <= 30:
            # Found a short-time entry (30 min) — this is the start of regulars
            num_specials = i
            break

    packages = []
    for i, (name_str, price_str) in enumerate(zip(name_lines, price_lines)):
        parsed = parse_package_name(name_str)
        if not parsed:
            print(f"WARNING: Could not parse package name: {name_str}")
            continue

        time_min, distance, display_name = parsed
        price = parse_price(price_str)

        if i < num_specials:
            display_name += ' (special)'

        packages.append((time_min, distance, price, display_name))

    return packages


def generate_typescript(packages):
    """Generate the cityBeePackages TypeScript array content."""
    lines = []

    # Separate specials from regulars
    regulars = [p for p in packages if '(special)' not in p[3]]
    specials = [p for p in packages if '(special)' in p[3]]

    for time_min, distance, price, name in regulars:
        lines.append(
            f"  {{ provider: 'CityBee', time: {time_min}, distance: {distance}, "
            f"price: {price:.2f}, name: '{name}' }},"
        )

    if specials:
        lines.append("  // Special offers")
        for time_min, distance, price, name in specials:
            lines.append(
                f"  {{ provider: 'CityBee', time: {time_min}, distance: {distance}, "
                f"price: {price:.2f}, name: '{name}' }},"
            )

    return lines


def update_data_ts(packages):
    """Replace the cityBeePackages array in data.ts."""
    with open(DATA_TS_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the start of the array
    start_marker = "export const cityBeePackages: Package[] = ["
    start_idx = content.find(start_marker)
    if start_idx == -1:
        print("ERROR: Could not find cityBeePackages in data.ts")
        sys.exit(1)

    # Find the closing ];
    array_start = start_idx + len(start_marker)
    bracket_idx = content.find('];', array_start)
    if bracket_idx == -1:
        print("ERROR: Could not find closing ]; for cityBeePackages")
        sys.exit(1)

    # Build new array content
    ts_lines = generate_typescript(packages)
    new_array_content = '\n' + '\n'.join(ts_lines) + '\n'

    # Replace
    new_content = content[:array_start] + new_array_content + content[bracket_idx:]

    with open(DATA_TS_PATH, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"Updated {DATA_TS_PATH} with {len(packages)} packages")


def main():
    print(f"Fetching {URL} ...")
    page_content = fetch_page()

    print("Extracting desktop section...")
    section = extract_first_desktop_section(page_content)

    print("Stripping HTML...")
    lines = strip_html(section)

    print(f"Parsed {len(lines)} lines")

    print("Building packages...")
    packages = build_packages(lines)

    print(f"Found {len(packages)} packages:")
    for time_min, distance, price, name in packages:
        print(f"  {name:25s} -> time={time_min:>6}min, dist={distance:>5}km, price={price:.2f}€")

    print("\nUpdating data.ts...")
    update_data_ts(packages)

    print("Done!")


if __name__ == '__main__':
    main()
