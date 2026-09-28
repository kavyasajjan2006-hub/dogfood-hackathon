# Dogfood Hackathon Platform

A self-hostable, open-source hackathon management and judging platform designed to demonstrate a complete hackathon lifecycle from participant registration and project submission to judge evaluation and leaderboard generation.

The platform is designed to be runnable locally without external cloud services, hosted databases, or external authentication providers.

## Features

### Participant Features

- User registration and login
- JWT-based authentication
- Hackathon project discovery
- Project creation
- Project submission
- Project submission deadline enforcement
- Team association
- Public project listing
- Search and filtering of projects
- Project details view
- GitHub repository and demo links

### Organizer/Admin Features

- Hackathon creation
- Track creation
- Judging criteria configuration
- Judge assignment
- Leaderboard access
- CSV leaderboard export

### Judge Features

- Judge authentication
- View assigned projects
- View judging criteria
- Submit project reviews
- Weighted rubric scoring
- Judge review history
- Judge progress information

### Platform Features

- SQLite database
- REST API
- JWT authentication
- Role-based authorization
- Seeded demonstration data
- Docker Compose deployment
- Frontend served through Nginx
- Backend served through Node.js/Express

---

# Technology Stack

## Frontend

- React
- Vite
- React Router
- Lucide React
- CSS

## Backend

- Node.js
- Express.js
- JWT
- bcryptjs
- better-sqlite3
- CORS

## Database

- SQLite

## Deployment

- Docker
- Docker Compose
- Nginx

---

# Project Structure

```text
Dogfood-hackathon/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── seed.js
│   │   └── server.js
│   │
│   ├── data/
│   │   └── dogfood.db
│   │
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── utils/
│   │
│   ├── Dockerfile
│   └── package.json
│
├── ARCHITECTURE.md
├── DATA-MODEL.md
├── JUDGING.md
├── LICENSE
└── README.md