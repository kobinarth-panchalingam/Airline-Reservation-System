# Docker Runbook

## Initial Setup

1. **Start the application using Docker Compose:**
    ```sh
    docker compose up
    ```

2. **Update the `.env` file:**
    ```env
    DB_HOST={privateIP} # can get from terminal by ipconfig
    DB_USER=postgres
    DB_PASSWORD=test123
    DB_DATABASE=airline
    DB_PORT=8795
    PORT=5000
    ```

## Updating the Application

1. **Build the updated Docker images:**
    ```sh
    docker compose build
    ```

2. **Start the application using Docker Compose:**
    ```sh
    docker compose up
    ```
