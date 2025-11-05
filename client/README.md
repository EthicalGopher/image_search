# Image Search Client

This is the frontend client for the Image Search application, built with React, TypeScript, Vite, and styled with Tailwind CSS and Shadcn UI. It interacts with the backend server to provide image search functionality, user authentication, and search history management.

## Table of Contents

- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Running the Client](#running-the-client)
- [Folder Structure](#folder-structure)

## Setup Instructions

### Prerequisites

Before running the client, ensure you have the following installed:

- Node.js (version 18 or higher)
- npm or Yarn or Bun (npm is used in the examples)

### Environment Variables

Create a `.env` file in the `client` directory with the following variables:

```
VITE_SERVER_URL="http://localhost:8080"
```

-   **`VITE_SERVER_URL`**: The URL of your backend server. By default, it's `http://localhost:8080`.

### Running the Client

1.  Navigate to the `client` directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
    The client application will be accessible at `http://localhost:5173`.

4.  To build the client for production:
    ```bash
    npm run build
    ```
    The build output will be in the `dist` directory.

## Folder Structure

```
client/
├───public/                 # Static assets
│   ├───favicon.ico
│   ├───placeholder.svg
│   └───robots.txt
├───src/                    # Source code
│   ├───App.css             # Main application CSS
│   ├───App.tsx             # Main application component
│   ├───index.css           # Global CSS
│   ├───main.tsx            # Entry point for the React application
│   ├───vite-env.d.ts       # Vite environment type definitions
│   ├───components/         # Reusable UI components
│   │   ├───ImageGrid.tsx
│   │   ├───SearchBar.tsx
│   │   ├───SearchHistory.tsx
│   │   ├───SelectionCounter.tsx
│   │   ├───TopSearches.tsx
│   │   └───ui/             # Shadcn UI components
│   ├───hooks/              # Custom React hooks
│   │   ├───use-mobile.tsx
│   │   └───use-toast.ts
│   ├───lib/                # Utility functions
│   │   └───utils.ts
│   └───pages/              # Page components
│       ├───Auth.tsx
│       ├───Index.tsx
│       └───NotFound.tsx
├───.gitignore              # Git ignore file
├───bun.lockb               # Bun lock file
├───components.json         # Shadcn UI components configuration
├───Dockerfile              # Dockerfile for containerization
├───eslint.config.js        # ESLint configuration
├───index.html              # Main HTML file
├───package-lock.json       # npm lock file
├───package.json            # Project dependencies and scripts
├───postcss.config.js       # PostCSS configuration
├───README.md               # Project README
├───tailwind.config.ts      # Tailwind CSS configuration
├───tsconfig.app.json       # TypeScript configuration for the application
├───tsconfig.json           # Base TypeScript configuration
├───tsconfig.node.json      # TypeScript configuration for Node.js environment
└───vite.config.ts          # Vite configuration
```