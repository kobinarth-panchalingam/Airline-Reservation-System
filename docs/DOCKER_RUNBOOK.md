# Docker Runbook

## Initial Setup

1. **Start the application using Docker Compose:**

   ```sh
   docker compose up
   ```

2. **Update the `.env` file:**
   ```env
   PGHOST=192.168.8.100
   PGUSER=postgres
   PGPASSWORD=test123
   PGDATABASE=airline
   PGPORT=8795
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

## Accessing the Database

```sh
psql -h {privateIP} -U postgres -d airline -p 8795
# password: test123
```
