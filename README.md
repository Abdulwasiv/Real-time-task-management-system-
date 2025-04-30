# Real-time-task-management-system-

# Task Management System - Full Stack Application

## Overview

This is a full-stack task management system with AI-powered features, built with:
- **Backend**: Golang with Gin/GORM
- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Database**: PostgreSQL
- **AI Integration**: OpenAI API for task suggestions and assignments

## Features

- User authentication (JWT)
- Task creation, assignment, and tracking
- AI-powered task suggestions
- Real-time updates via WebSockets
- Priority and complexity scoring for tasks
- Bulk task upload via CSV

## System Architecture

```
/backend
 /api
 /controllers
 /models
 /routers
 /websocket
 main.go
 go.mod

/frontend
 /pages
 /components
 /styles
 next.config.js
 package.json
```

## Backend Setup (Golang)

### Prerequisites

- Go 1.20+
- PostgreSQL 14+
- Redis (for WebSocket hub)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/abdulwasiv.h/task-management-system.git
cd task-management-system/backend
```

2. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your configuration:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=tasks
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
```

3. Install dependencies:
```bash
go mod download
```

4. Run migrations:
```bash
go run main.go -migrate
```

5. Start the server:
```bash
go run main.go
```

### API Endpoints

| Method | Endpoint | Description |
|--------|------------------------|---------------------------------|
| POST | /user/register | Register new user |
| POST | /user/login | User login |
| PUT | /user/logout | User logout |
| POST | /task/create | Create new task |
| PATCH | /task/update/:id | Update task |
| GET | /task/suggestions | Get AI task suggestions |
| POST | /task/assign/:id | Assign task using AI |
| POST | /task/bulkupload | Bulk upload tasks from CSV |

## Frontend Setup (Next.js)

### Prerequisites

- Node.js 18+
- npm/yarn

### Installation

1. Navigate to frontend directory:
```bash
cd ../frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```
Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3000
```

4. Run development server:
```bash
npm run dev
# or
yarn dev
```

5. For production:
```bash
npm run build
npm start
```

## Deployment

### Backend

Deploy to Render/Fly.io:
```bash
# For Render
render deploy

# For Fly.io
fly deploy
```

### Frontend

Deploy to Vercel:
```bash
vercel
```

## Development Workflow

1. Start backend:
```bash
cd backend && go run main.go
```

2. Start frontend:
```bash
cd frontend && npm run dev
```

3. Access the application at:
```
http://localhost:3000 (frontend)
http://localhost:8080 (backend API)
```

## Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=tasks
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3000
```

## Testing

Run backend tests:
```bash
cd backend
go test ./...
```

Run frontend tests:
```bash
cd frontend
npm test
```

## CI/CD

GitHub Actions workflow included for:
- Automated testing
- Build verification
- Deployment to staging

## Troubleshooting

1. **Database connection issues**:
 - Verify PostgreSQL is running
 - Check `.env` credentials
 - Run migrations manually if needed

2. **Frontend build errors**:
 - Delete `node_modules` and reinstall
 - Check TypeScript type definitions

3. **WebSocket connection problems**:
 - Verify Redis is running
 - Check CORS settings

