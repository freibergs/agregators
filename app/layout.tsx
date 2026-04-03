import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Car Sharing Calculator LV",
  description: "Find the cheapest car sharing option between CityBee, Bolt, and CarGuru for your trip. Compare packages and get the best deal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0a0a0f] text-zinc-200 antialiased`}>{children}</body>
    </html>
  );
}
