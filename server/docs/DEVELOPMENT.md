# Development Guide


1. **Clone the Repository**
    ```sh
    git clone https://github.com/kobinarth-panchalingam/Airline-Reservation-System.git
    cd airline-reservation-system
    ```
2. **Set Up ESLint and Prettier**
    - Download the [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extension for VSCode:
    - Download the [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extension for VSCode.

3. **Install Dependencies**
    ```sh
    npm install
    ```

4. **Environment Variables**
    - Create a `.env` file in the root directory and add the necessary environment variables.
    - Example:
        ```env
        DB_HOST=localhost
        DB_USER=yourusername
        DB_PASSWORD=yourpassword
        DB_DATABASE=airline_reservation
        PORT=3000
        ```

5. **Node.js Version**
    - Ensure you are using lastest Node.js version 22.13.0
    - You can check your Node.js version with:
        ```sh
        node -v
        ```

6. **Running the Application**
    ```sh
    npm start
    ```

## Deployment

1. **Deployment Link**
    - The application is deployed at: [https://airline-reservation-system-dev.vercel.app/](https://airline-reservation-system-dev.vercel.app/)

2. **Deployment Steps**
    - Ensure all tests pass before deploying.
    - Merge the `dev` branch into the `main` branch.
    - Push the `main` branch to the remote repository.
    - The deployment process will be triggered automatically via CI/CD pipeline.

## Additional Resources

1. **Postman Workspace**
    - Access the Postman workspace at: [https://app.getpostman.com/airline-reservation](https://app.getpostman.com/join-team?invite_code=27b42d80fd87d5fe667e29bb06fbc890e6f6d87c4a7fe79eab46b4a1410bb3d3&target_code=042ecaab342c8edb3a6b2aaa27e2c720)
