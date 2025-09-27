# Volt - Client Application

Client serves as the frontend for the Volt ecosystem, providing an interface for file management, user authentication, and dashboard functionality.

## Features

- **Modern React Architecture**: Built with React 19 and TypeScript
- **File Management Interface**: Upload, view, and manage files
- **User Authentication**: Registration, login, and profile management
- **Protected Routes**: Route-based authentication and authorization
- **Real-time Updates**: Dynamic file upload progress and storage statistics
- **Dashboard Analytics**: Visual storage statistics and file management
- **Error Handling**: Comprehensive error handling and user feedback

## Prerequisites

- **Node.js**: Version 18.0 or higher
- **bun/npm/yarn/pnpm**: Package manager of choice

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd volt/client
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Start Development Server

```bash
bun dev
```

## Project Structure

```
client/
├── public/                 # Static assets
│   └── icon.svg           # App icon
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── core/         # Core UI components
│   │   ├── dashboard/    # Dashboard-specific components
│   │   ├── forms/        # Form components
│   │   └── icons/        # Icon components
│   ├── pages/            # Page components
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration files
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── biome.json           # Code formatting configuration
```

## Available Scripts

```bash
# Start development server
npm run dev

# Type checking
npm run type:check

# Format code
npm run format

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## Key Components

### Pages

- **LandingPage**: Welcome page with app introduction
- **LoginPage**: User authentication form
- **RegisterPage**: User registration form
- **DashboardPage**: File management dashboard
- **ProfilePage**: User profile management

## Development Tools

- **Vite**: Fast build tool and dev server
- **TypeScript**: Type safety and better DX
- **Tailwind CSS**: Utility-first CSS framework
- **Biome**: Fast formatter and linter
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls

## Development Guidelines

### Code Style

The project uses Biome for code formatting and linting:

```bash
# Check code style
npm run lint

# Fix formatting issues
npm run format

# Auto-fix linting issues
npm run lint:fix
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b new-feature`)
3. Commit your changes (`git commit -m 'feat (client): new feature'`)
4. Push to the branch (`git push`)
5. Open a Pull Request
