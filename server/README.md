# Image Search Server

This is the backend server for the Image Search application, built with Go and Fiber. It handles user authentication, image searching via the Unsplash API, and manages user search history.

## Table of Contents

- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Running the Server](#running-the-server)
- [Folder Structure](#folder-structure)
- [API Endpoints](#api-endpoints)
  - [Health Check](#health-check)
  - [Authentication](#authentication)
  - [Image Search](#image-search)
  - [Search History](#search-history)

## Setup Instructions

### Prerequisites

Before running the server, ensure you have the following installed:

- Go (version 1.21 or higher)
- MongoDB (or access to a MongoDB instance)

### Environment Variables

Create a `.env` file in the `server` directory with the following variables:

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

-   **`MONGODB_URI`**: Your MongoDB connection string. Example: `mongodb://localhost:27017`.
-   **`UNSPLASH_ACCESS_KEY`**: Obtain this from the [Unsplash Developer website](https://unsplash.com/developers).
-   **`GOOGLE_CLIENT_ID`**, **`GOOGLE_CLIENT_SECRET`**: Obtain these from the [Google Cloud Console](https://console.cloud.google.com/). Set the authorized redirect URI to `http://localhost:8080/api/auth/google/callback`.
-   **`GITHUB_CLIENT_ID`**, **`GITHUB_CLIENT_SECRET`**: Obtain these from [GitHub Developer Settings](https://github.com/settings/developers). Set the authorized redirect URI to `http://localhost:8080/api/auth/github/callback`.
-   **`FACEBOOK_CLIENT_ID`**, **`FACEBOOK_CLIENT_SECRET`**: Obtain these from the [Facebook for Developers](https://developers.facebook.com/) portal. Set the authorized redirect URI to `http://localhost:8080/api/auth/facebook/callback`.

### Running the Server

1.  Navigate to the `server` directory:
    ```bash
    cd server
    ```
2.  Install Go modules:
    ```bash
    go mod tidy
    ```
3.  Run the server:
    ```bash
    go run main.go
    ```
    The server will start on `http://localhost:8080`.

## Folder Structure

```
server/
├───.env                  # Environment variables
├───Dockerfile            # Dockerfile for containerization
├───go.mod                # Go module dependencies
├───go.sum                # Go module checksums
├───main.go               # Main application entry point and API routes
├───database/
│   └───db.go             # Database connection and CRUD operations
└───datatypes/
    └───types.go          # Data structures and models
```

## API Endpoints

All API endpoints are prefixed with `/api`.

### Health Check

#### `GET /health`

Checks if the server is running.

**cURL Example:**

```bash
curl -X GET http://localhost:8080/health
```

**Response:**

```
(Status: 200 OK)
```

### Authentication

#### `GET /api/auth/:provider`

Initiates the OAuth authentication flow with the specified provider.

-   `:provider`: Can be `google`, `github`, or `facebook`.

**cURL Example (Google):**

```bash
curl -X GET http://localhost:8080/api/auth/google
```

**Response:**

Redirects to the Google authentication page.

#### `GET /api/auth/:provider/callback`

Callback URL for OAuth providers. After successful authentication, the user is redirected to the frontend with user details.

-   `:provider`: Can be `google`, `github`, or `facebook`.

**Note:** This endpoint is typically handled automatically by the OAuth flow and not called directly.

#### `GET /api/logout`

Logs out the currently authenticated user by destroying their session.

**cURL Example:**

```bash
curl -X GET http://localhost:8080/api/logout
```

**Response:**

```
(Status: 200 OK)
```

### Image Search

#### `GET /api/search-guest`

Searches for random images for guest users.

**Query Parameters:**

-   `page` (integer, required): The page number for results.

**cURL Example:**

```bash
curl -X GET "http://localhost:8080/api/search-guest?page=1"
```

**Response (JSON):**

```json
{
  "total": 1000,
  "total_pages": 100,
  "results": [
    {
      "id": "image_id_1",
      "alt_description": "description_1",
      "urls": {
        "raw": "...",
        "full": "...",
        "regular": "...",
        "small": "...",
        "thumb": "..."
      },
      // ... other image details
    }
  ]
}
```

#### `GET /api/search`

Searches for images based on a term for authenticated users. Also records the search term in the user's history.

**Query Parameters:**

-   `term` (string, required): The search query (e.g., "nature", "cars").
-   `page` (integer, optional, default: 1): The page number for results.

**cURL Example:**

```bash
curl -X GET "http://localhost:8080/api/search?term=mountains&page=1"
```

**Response (JSON):**

```json
{
  "total": 500,
  "total_pages": 50,
  "results": [
    {
      "id": "image_id_2",
      "alt_description": "description_2",
      "urls": {
        "raw": "...",
        "full": "...",
        "regular": "...",
        "small": "...",
        "thumb": "..."
      },
      // ... other image details
    }
  ]
}
```

### Search History

#### `GET /api/top-searches`

Retrieves the top 5 most searched terms across all users.

**cURL Example:**

```bash
curl -X GET http://localhost:8080/api/top-searches
```

**Response (JSON):**

```json
[
  "nature",
  "cars",
  "technology",
  "animals",
  "food"
]
```

#### `GET /api/history`

Retrieves the search history (terms and timestamps) for the authenticated user.

**cURL Example:**

```bash
curl -X GET http://localhost:8080/api/history
```

**Response (JSON):**

```json
{
  "terms": [
    "mountains",
    "rivers",
    "mountains"
  ],
  "time_stamp": [
    "2023-10-27T10:00:00Z",
    "2023-10-27T10:05:00Z",
    "2023-10-27T10:15:00Z"
  ]
}
```

#### `POST /api/history/clear`

Clears the search history for the authenticated user.

**cURL Example:**

```bash
curl -X POST http://localhost:8080/api/history/clear
```

**Response:**

```
(Status: 200 OK)
```
