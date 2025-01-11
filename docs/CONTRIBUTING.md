# Contributing to Airline Reservation System

Thank you for considering contributing to our project! Here are some guidelines and best practices to follow when working on this Express.js project.

## Project Structure
    ├── 📁 configs
    │   ├── app.config.js
    │   └── db.config.js
    ├── 📁 controllers
    │   ├── book.controller.js
    │   └── user.controller.js
    ├── 📁 middlewares
    │   ├── has-token.js
    │   └── is-admin.js
    ├── 📁 models
    │   ├── book.model.js
    │   └── user.model.js
    ├── 📁 public
    ├── 📁 routers
    │   ├── book.router.js
    │   ├── router.js
    │   └── user.router.js
    ├── 📁 services
    │   ├── book.service.js
    │   └── user.service.js
    ├── 📁 test
    │   ├── 📁 integration
    │   └── 📁 unit
    │       ├── 📁 services
    │       │   ├── book.service.test.js
    │       │   └── user.service.test.js
    │       └── 📁 utils
    │           └── foo.test.js
    ├── 📁 utils
    |   └── foo.js
    ├── app.js
    └── server.js

## Coding Standards

1. **Code Style**
    - Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).
    - Use `eslint` to enforce coding standards.
    - Use 2 spaces for indentation.

2. **Naming Conventions**
    - Use `camelCase` for variable and function names.
    - Use `PascalCase` for class names.
    - Use `UPPER_CASE` for constants.
    - Use `UPPER_SNAKE_CASE` for environment variables.

## Dependencies Management

1. **Adding Dependencies**
    - Use `npm install <package-name>` to add new dependencies.
    - Use `--save` flag to add the dependency to `dependencies` in `package.json`.
    - Use `--save-dev` flag to add the dependency to `devDependencies` in `package.json`.

2. **Updating Dependencies**
    - Regularly check for outdated packages using `npm outdated`.
    - Update dependencies using `npm update` or `npm install <package-name>@latest`.
    - Test the application thoroughly after updating dependencies to ensure compatibility.

3. **Removing Dependencies**
    - Use `npm uninstall <package-name>` to remove a dependency.
    - Ensure that the dependency is not used anywhere in the codebase before removing it.

4. **Version Control**
    - Use semantic versioning for dependencies.
    - Avoid using `*` or `latest` for version numbers to prevent unexpected breaking changes.
    - Do not delete `package-lock.json` to ensure consistent dependency versions across different environments.

## REST API Naming Conventions

1. **HTTP Methods**
    - Use appropriate HTTP methods for actions:
    - `GET`: Retrieve data (e.g., `/users` or `/users/{id}`).
    - `POST`: Create a new resource (e.g., `/users`).
    - `PUT`: Update an existing resource (replace) (e.g., `/users/{id}`).
    - `PATCH`: Update part of a resource (partial update) (e.g., `/users/{id}`).
    - `DELETE`: Delete a resource (e.g., `/users/{id}`).

2. **Resource Names**
    - Use plural nouns for resource names.
    - Use hyphens to separate words for readability - !this is the only place where we use hypens.
    - Example: `/users`, `/flights`, `/bookings`, `/aircraft-models`

3. **Query Parameters**
    - Use query parameters for filtering, sorting, and pagination (optional).
    - Example: `/flights?origin=NYC&destination=LAX&sort=departure_time`.

4. **Path Parameters**
    - Use resource IDs in the path for specific resources. (e.g., `/users/{id}`).
    - Avoid using query strings for IDs. (e.g., `/users?id=123`).

3. **Endpoint Structure**
    - Use hierarchical structure for endpoints.

4. **Response Body Naming Conventions**
    - Use `snake_case` for JSON keys.
    - Ensure consistency in naming conventions across all response bodies.
    - Example:
        ```json
        {
            "user_id": 123,
            "user_name": "JohnDoe",
            "user_email": "john.doe@example.com"
        }
    - Use a consistent structure for error responses to ensure clarity and uniformity.
    - Example:
        ```json
        {
            "error": {
                "code": "INVALID_INPUT",
                "message": "string"
            }
        }
        ```

5. **Status Codes**
    - Use appropriate HTTP status codes for responses:
        - `200 OK` for successful GET, PUT, or DELETE.
        - `201 Created` for successful POST.
        - `204 No Content` for successful request with no body in response.
        - `400 Bad Request` for invalid requests.
        - `401 Unauthorized` for unauthorized requests.
        - `403 Forbidden` for access denied requests.
        - `404 Not Found` for non-existent resources.
        - `500 Internal Server Error` for internal server errors.

By following these guidelines, you help ensure that our codebase remains clean, maintainable, and efficient. Thank you for your contributions!
