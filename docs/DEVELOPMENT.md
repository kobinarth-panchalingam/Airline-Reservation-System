# Development Guide

## Initial Environment Setup

1. **Clone the Repository**
   ```sh
   git clone https://github.com/kobinarth-panchalingam/Airline-Reservation-System.git
   cd airline-reservation-system
   git checkout dev
   ```
2. **Development Instruction**

   - To ensure that Git is case-sensitive when dealing with file names, configure the `core.ignorecase` setting to `false`. This is particularly useful in environments where case sensitivity is important, such as when working with files on a case-sensitive file system.
   - Run the following command to set this configuration:

   ```sh
   git config core.ignorecase false
   ```

3. **Set Up ESLint and Prettier**

   - Download the [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extension for VSCode:
   - Download the [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extension for VSCode.

4. **Install Dependencies**

   ```sh
   npm install
   ```

5. **Environment Variables**

   - Create a `.env` file in the root directory and add the necessary environment variables.

     ```env
      # App config
      PORT=5000
      NODE_ENV=development

      # Postgres config local
      PGHOST=localhost
      PGPORT=5432
      PGUSER=postgres
      PGPASSWORD=password
      PGDATABASE=airline
     ```

6. **Node.js Version**

   - Ensure you are using lastest Node.js version 22.13.0
   - You can check your Node.js version with:
     ```sh
     node -v
     ```

7. **Running the Application**
   ```sh
   npm start
   ```

## Git Workflow

1. **Branching**

   - Create a new branch from the `dev` branch for your work:

   ```sh
   git checkout -b your-branch-name dev
   ```

   - Use feature branches for new features (`feature/feature-name`).
   - Use bugfix branches for bug fixes (`bugfix/bug-name`).
   - Use `main` branch for production-ready code.

2. **Commits**

   - Write clear and concise commit messages.
   - Use present tense ("Add feature" not "Added feature").
   - Reference issues in commit messages when applicable.

3. **Pull Requests**
   - Pull the latest changes from the `dev` branch and merge them into your feature or bugfix branch before creating a pull request.
   - Provide a clear description of the changes.
   - Request reviews from relevant team members.
   - Ensure your merge request is directed to the `dev` branch.

## Deployment

1. **Deployment Link**
   - The application is deployed at: [https://airline-reservation-system-dev.vercel.app/](https://airline-reservation-system-dev.vercel.app/)
2. **Deployed Databse**
   ```
   PGHOST=ep-misty-union-a1b7ni07-pooler.ap-southeast-1.aws.neon.tech
   PGPORT=5432
   PGUSER=neondb_owner
   PGPASSWORD=ijgKpUc9r1fv
   PGDATABASE=airline
   ```

## Additional Resources

1. **Postman Workspace**

   - Access the Postman workspace at: [https://app.getpostman.com/airline-reservation](https://app.getpostman.com/join-team?invite_code=27b42d80fd87d5fe667e29bb06fbc890e6f6d87c4a7fe79eab46b4a1410bb3d3&target_code=042ecaab342c8edb3a6b2aaa27e2c720)

2. **Database ERD**
   - Access lucid chart editable diargram ar: [https://lucid.app/lucidchart](https://lucid.app/lucidchart/724da39b-9cc4-4bf5-a270-66bf53f3430c/edit?viewport_loc=-853%2C-717%2C2157%2C1248%2C0_0&invitationId=inv_dc351c39-96dd-4f21-b94b-d1276b779c7a)
