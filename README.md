## Shivansh Jewellery Backend (Node + TS + Sequelize)

Express + TypeScript backend using **Sequelize (MySQL)** with **AJV** request validation, JWT auth, and seeders.

### Requirements
- **Node.js**: 18+ recommended
- **MySQL**: 8+

### Project setup
Install dependencies:

```bash
npm install
```

Create an env file:
- Create **`.env`** in the project root (do not commit it).
- Use this template:

```bash
# Server environment: development, staging, production
NODE_ENV=development

# API PORT
PORT=5005

# API url (optional)
API_URL=http://localhost:5005/api

# DATABASE CONFIGURATION
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
DB_NAME=shivansh_dev

# JWT Secret
SECRET_KEY=change_me

# SMTP (optional - used for forgot password)
SMTP_SERVICE=gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=false
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_RECEIVER_EMAIL=your_receiver@gmail.com

# Seed on server start (optional)
SEED=false
```

### Run the server
Development (watch mode):

```bash
npm run start:dev
```

Production build + run:

```bash
npm run start
```

### Database behavior (important)
On server start (`src/server.ts`):
- Connects to MySQL and **creates the DB if missing**
- Initializes Sequelize models
- Runs `sequelize.sync({ alter: true })` (auto-alters tables to match models)
- Optionally runs seeders if `SEED=true`

### Seeding
Run seeders manually:

```bash
npm run seed
```

Seeders live in `src/seeders/` and are orchestrated via `src/seeders/index.seeder.ts`.

Default data included:
- **Users** (`DEFAULT_USERS`)
- **Permissions** (`DEFAULT_PERMISSIONS`)
- **User permissions** (`user_permission` rows generated from user role defaults)

### Postman
Postman files are available in `postman/`:
- `postman/Shivansh_Back.postman_collection.json`
- `postman/Shivansh_Back.local.postman_environment.json`

The **Login** request stores JWT automatically into the environment as `token`.

### API base path
All routes are mounted under:
- **`/api`**

Health endpoints:
- `GET /`
- `GET /health`

### Modules and routes
#### Auth (`/api/auth`)
- `POST /register`
- `POST /login` (stores token in Postman)
- `POST /forgot-password`
- `POST /change-password` (Bearer token required)

#### Users (`/api/user`)
Admin:
- `GET /all`
- `GET /` (paginated)
- `GET /:id`
- `POST /` (create user + assign permissions)
- `PUT /:id` (update user + assign permissions)
- `DELETE /:id`

Profile:
- `GET /profile/me`
- `PUT /profile` (multipart: `profile_pic`)

#### Permissions (`/api/permission`) (Admin)
- `GET /all`
- `GET /` (paginated)
- `GET /:id`
- `POST /`
- `PUT /:id`
- `DELETE /:id`

### Folder structure
High-level layout:
- **`src/app.ts`**: Express app setup + middleware + route mount
- **`src/server.ts`**: DB init + model init + sync + seed + server start
- **`src/config/`**: database configuration / env mapping
- **`src/models/`**: Sequelize models (table mappings)
- **`src/controllers/`**: request handlers (transactions + responses)
- **`src/services/`**: DB operations / business logic
- **`src/routes/`**: Express routers grouped by module
- **`src/validations/`**: AJV schemas for request validation
- **`src/middlewares/`**: auth, validation, error handler, etc.
- **`src/seeders/`**: seed constants + seed runner(s)
- **`src/utils/`**: helper utilities (crypto, permissions helper, etc.)
- **`src/interfaces/`**: TypeScript interfaces for DTOs/pagination/etc.
- **`postman/`**: Postman collection + environments

### Coding structure (patterns used)
- **Routes**: define URL + middleware chain (`authenticateToken`, `checkRole`, `validateSchema`)
- **Controllers**:
  - Start Sequelize transaction when writing
  - Validate existence/uniqueness where needed
  - Use `sendSuccessResponse`, `sendBadRequestResponse`, etc.
  - Commit/rollback transaction
- **Services**:
  - Only DB queries and small query helpers
  - Soft delete pattern using `is_deleted = true`

### Notes
- **Do not commit** `.env` (contains secrets). Use an `.env.example` if you want to share keys without values.
- This project currently uses `sequelize.sync({ alter: true })` instead of migrations. For production, consider migrations for stricter control.
