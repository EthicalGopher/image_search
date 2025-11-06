# Image Search Application

This is a full-stack image search application that allows users to search for images, manage their search history, and authenticate using various OAuth providers. The application consists of a Go Fiber backend and a React TypeScript frontend.

## About The Project

This project is a demonstration of a modern full-stack web application. It showcases how to build a secure and scalable application with a Go backend and a React frontend. The application allows users to search for images using the Unsplash API, view their search history, and see the top searches across all users. It also includes a guest mode for users who do not want to authenticate.

### Built With

*   **Frontend:**
    *   [React](https://reactjs.org/)
    *   [TypeScript](https://www.typescriptlang.org/)
    *   [Vite](https://vitejs.dev/)
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   [Shadcn UI](https://ui.shadcn.com/)
*   **Backend:**
    *   [Go](https://golang.org/)
    *   [Fiber](https://gofiber.io/)
    *   [MongoDB](https://www.mongodb.com/)
    *   [Goth](https://github.com/markbates/goth)

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

*   **Go:** Make sure you have Go (version 1.21 or higher) installed. You can download it from [here](https://golang.org/dl/).
*   **Node.js:** Make sure you have Node.js (version 18 or higher) installed. You can download it from [here](https://nodejs.org/).
*   **MongoDB:** Make sure you have a MongoDB instance running. You can use a local instance or a cloud-based service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/your_username_/image_search.git
    ```
2.  **Set up the backend**
    *   Navigate to the `server` directory:
        ```sh
        cd image_search/server
        ```
    *   Create a `.env` file and add the following environment variables:
        ```
        MONGODB_URI="your_mongodb_connection_string"
        UNSPLASH_ACCESS_KEY="your_unsplash_access_key"
        GOOGLE_CLIENT_ID="your_google_client_id"
        GOOGLE_CLIENT_SECRET="your_google_client_secret"
        GITHUB_CLIENT_ID="your_github_client_id"
        GITHUB_CLIENT_SECRET="your_github_client_secret"
        FACEBOOK_CLIENT_ID="your_facebook_client_id"
        FACEBOOK_CLIENT_SECRET="your_facebook_client_secret"
        ```
    *   Install the Go modules:
        ```sh
        go mod tidy
        ```
    *   Run the backend server:
        ```sh
        go run main.go
        ```
3.  **Set up the frontend**
    *   Navigate to the `client` directory:
        ```sh
        cd ../client
        ```
    *   Install the npm packages:
        ```sh
        npm install
        ```
    *   Run the frontend development server:
        ```sh
        npm run dev
        ```

## Features

*   **User Authentication:** Secure login via Google, GitHub, and Facebook OAuth.
*   **Image Search:** Search for images using the Unsplash API.
*   **Search History:** Authenticated users can view and clear their search history.
*   **Top Searches:** View the most popular search terms across all users.
*   **Guest Search:** Guests can search for random images without authentication.
*   **Game:** A simple game for authenticated users.

## Available Scripts

### Frontend

*   `npm run dev`: Runs the app in the development mode.
*   `npm run build`: Builds the app for production to the `dist` folder.
*   `npm run lint`: Lints the code using ESLint.
*   `npm run preview`: Serves the production build locally.

### Backend

*   `go run main.go`: Runs the backend server.
*   `go build`: Builds the backend server.

## Project Structure

```
.
├── client
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── game
│   │   ├── hooks
│   │   ├── lib
│   │   └── pages
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.ts
├── server
│   ├── database
│   ├── datatypes
│   ├── .env
│   ├── Dockerfile
│   ├── go.mod
│   └── main.go
└── README.md
```

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter) - email@example.com

Project Link: [https://github.com/your_username_/image_search](https://github.com/your_username_/image_search)