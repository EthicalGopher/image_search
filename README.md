# Image Search Application

This is a full-stack image search application that allows users to search for images, manage their search history, and authenticate using various OAuth providers. The application consists of a Go Fiber backend and a React TypeScript frontend.

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Client-side Documentation](#client-side-documentation)
- [Server-side Documentation](#server-side-documentation)

## Project Overview

The application provides the following features:

-   **User Authentication**: Secure login via Google, GitHub, and Facebook OAuth.
-   **Image Search**: Search for images using the Unsplash API.
-   **Search History**: Authenticated users can view and clear their search history.
-   **Top Searches**: View the most popular search terms across all users.
-   **Guest Search**: Guests can search for random images without authentication.

## Technologies Used

### Frontend (Client)

-   **React**: A JavaScript library for building user interfaces.
-   **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
-   **Vite**: A fast build tool that provides an instant development server.
-   **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
-   **Shadcn UI**: A collection of reusable components built with Radix UI and Tailwind CSS.
-   **React Router DOM**: Declarative routing for React.
-   **Axios**: Promise-based HTTP client for the browser and Node.js.
-   **@tanstack/react-query**: Powerful asynchronous state management for React.

### Backend (Server)

-   **Go**: A statically typed, compiled programming language.
-   **Fiber**: An Express-inspired web framework built on top of Fasthttp.
-   **MongoDB**: A NoSQL document database for storing user search history.
-   **Goth**: A Go package for OAuth authentication.
-   **Unsplash API**: For fetching image data.

## Setup Instructions

To get the application up and running, you need to set up both the client and the server.

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd image_search
    ```

2.  **Set up the Server:**
    Follow the detailed instructions in the [Server README](./server/README.md) to configure environment variables (including Unsplash API key and OAuth credentials) and run the backend server.

3.  **Set up the Client:**
    Follow the detailed instructions in the [Client README](./client/README.md) to configure environment variables and run the frontend application.

## Client-side Documentation

For detailed information on the frontend application, including its setup, scripts, and folder structure, please refer to the [Client README](./client/README.md).

## Server-side Documentation

For detailed information on the backend server, including its setup, API endpoints, and folder structure, please refer to the [Server README](./server/README.md).
