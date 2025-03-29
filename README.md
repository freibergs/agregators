# CityBee vs Bolt Car Sharing Calculator

This application helps users find the most cost-effective car sharing option between CityBee and Bolt based on trip duration and distance. The calculator compares standard rates and all available packages to find the best deal.

## Features

- Calculate and compare prices between CityBee and Bolt
- Find the best package for your specific trip
- Account for extra charges when exceeding package limits
- Interactive visualizations of prices, time, and distance
- Comprehensive package comparison table
- Responsive design for desktop and mobile

## Technology Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Chart.js](https://www.chartjs.org/) - Data visualization
- [React Hook Form](https://react-hook-form.com/) - Form handling

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Building for Production

```bash
npm run build
# or
yarn build
```

Start the production server:

```bash
npm start
# or
yarn start
```

## How It Works

The calculator performs the following operations:

1. Calculates standard prices based on time and distance for both services
2. Checks all available packages from both providers
3. Calculates any additional charges if package limits are exceeded
4. Recommends the most cost-effective option

## Data Sources

The pricing information is based on current (as of project creation) rates for:

- CityBee (orange cars)
- Bolt (green cars)

Prices and packages are subject to change, so it's advisable to verify the information with the service providers.

## License

This project is open source and available under the MIT License.
