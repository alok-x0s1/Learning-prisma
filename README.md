# Task Management Backend

A simple yet powerful backend for a task management system, built using Express, Prisma, PostgreSQL, and TypeScript. This project allows users to manage projects, assign tasks, and track progress, while ensuring proper role-based access control.

## Features

- **User Management:** Supports user roles (ADMIN, MANAGER, EMPLOYEE) to control permissions.
- **Project Management:** Create and manage projects with tasks.
- **Task Assignment:** Assign tasks to team members with due dates and track their status (TODO, IN_PROGRESS, COMPLETED).
- **Role-Based Access Control (RBAC):** Users can have different roles that limit their permissions.
- **Prisma ORM:** Efficiently handles database interactions with PostgreSQL.
- **TypeScript:** Ensures type safety and modern development practices.

## Database Schema

- **User:** Handles user details, roles, and task assignments.
- **Project:** Manages project details and relationships with tasks.
- **Task:** Tracks tasks with status updates, assignees, and deadlines.

## Installation

To set up and run this application locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/alok-x0s1/Learning-prisma.git
   cd Learning-prisma
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up the environment variables:**

   Create a `.env` file in the root of your project and add the following:

   ```env
   PORT=3000
   DATABASE_URL=your_postgresql_database_url
   CORS_ORIGIN=http://localhost:3000  # Frontend URL
   JWT_TOKEN_SECRET=your_jwt_secret_key
   JWT_TOKEN_EXPIRY=7d   #your_jwt_secret_key_expiry
   ```

4. **Run database migrations:**

   Use Prisma to migrate your schema to the PostgreSQL database:

   ```bash
   npx prisma migrate dev --name init
   ```

5. **Start the application:**

   For development mode (with `nodemon`):

   ```bash
   npm run dev
   ```

   For production:

   ```bash
   npm run build
   npm start
   ```

## API Endpoints

Here are some of the primary API endpoints:

- `POST /auth/login`: Login and obtain a JWT token.
- `GET /projects`: Retrieve all projects for a user.
- `POST /projects`: Create a new project.
- `PUT /projects/:id`: Update project details.
- `DELETE /projects/:id`: Delete a project.
- `GET /tasks`: Retrieve all tasks assigned to a user.
- `POST /tasks`: Create a new task.
- `PUT /tasks/:id`: Update a task's title, description, or due date.