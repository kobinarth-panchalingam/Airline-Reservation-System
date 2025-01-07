# Contributing to Airline Reservation System

Thank you for considering contributing to our project! Here are some guidelines and best practices to follow when working on this Express.js project.

## Project Structure
    ├── 📁 configs
    │   ├── app.config.js
    │   └── db.config.js
    ├── 📁 controllers
    │   ├── book.controller.js
    │   └── user.controller.js
    ├── app.js
    ├── server.js
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
        └── foo.js

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

## Best Practices

1. **Error Handling**
    - Use middleware for centralized error handling.
    - Always return meaningful error messages.
    - Avoid using generic error messages.

2. **Security**
    - Use `helmet` to set HTTP headers for security.
    - Sanitize user inputs to prevent SQL injection and XSS attacks.
    - Use environment variables for sensitive information.

3. **Performance**
    - Use `compression` middleware to gzip responses.
    - Optimize database queries.
    - Use caching where appropriate.

4. **Testing**
    - Write unit tests for all functions and methods.
    - Use `mocha` and `chai` for testing.
    - Ensure tests cover edge cases and potential failure points.

5. **Documentation**
    - Comment your code where necessary.
    - Update the README.md with any new features or changes.
    - Use JSDoc for documenting functions and methods.

## Git Workflow

1. **Branching**
    - Use feature branches for new features (`feature/feature-name`).
    - Use bugfix branches for bug fixes (`bugfix/bug-name`).
    - Use `main` branch for production-ready code.

2. **Commits**
    - Write clear and concise commit messages.
    - Use present tense ("Add feature" not "Added feature").
    - Reference issues in commit messages when applicable.

3. **Pull Requests**
    - Ensure your code passes all tests before creating a pull request.
    - Provide a clear description of the changes.
    - Request reviews from relevant team members.

By following these guidelines, you help ensure that our codebase remains clean, maintainable, and efficient. Thank you for your contributions!
