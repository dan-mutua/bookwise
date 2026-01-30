# BookWise - Smart Bookmark Manager

A production-ready bookmark management system with ML-powered automatic classification and tagging.

## Architecture

- **Backend**: NestJS + TypeORM + PostgreSQL
- **ML Service**: FastAPI + Python (rule-based classifier)
- **Deployment**: Docker Compose multi-service setup
- **Database**: PostgreSQL 15 with proper relationships and migrations

## Features

- **Automatic Classification**: ML service automatically categorizes bookmarks into 7 categories (technology, news, social, entertainment, shopping, education, reference)
- **Smart Tagging**: Automatically suggests relevant tags based on URL and title analysis
- **Full CRUD Operations**: Manage users, bookmarks, and tags
- **Advanced Filtering**: Search by category, tags, favorites, or full-text search
- **User Isolation**: Each user can only access their own bookmarks
- **Graceful Degradation**: System continues to work even if ML service is unavailable

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local ML service development)

### Running with Docker Compose

1. Clone the repository and navigate to the project directory:
```bash
cd bookwise
```

2. Start all services:
```bash
docker-compose up --build
```

3. Services will be available at:
   - Backend API: http://localhost:3001/api
   - ML Service: http://localhost:5000
   - PostgreSQL: localhost:5432
   - pgAdmin: http://localhost:8080

### Health Checks

```bash
# Backend health
curl http://localhost:3001/api

# ML Service health
curl http://localhost:5000/health
```

## API Documentation

### Base URL
```
http://localhost:3001/api
```

### Users

#### Create User
```bash
POST /users
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Get User
```bash
GET /users/:id
```

#### Get All Users
```bash
GET /users
```

### Bookmarks

#### Create Bookmark (with ML Classification)
```bash
POST /bookmarks
Content-Type: application/json

{
  "url": "https://github.com/nestjs/nest",
  "title": "NestJS Framework",
  "description": "Progressive Node.js framework",
  "userId": "user-id-here",
  "tags": ["nodejs"],
  "isFavorite": false
}

# Response includes ML classification:
{
  "id": "bookmark-id",
  "url": "https://github.com/nestjs/nest",
  "title": "NestJS Framework",
  "mlCategory": "technology",
  "mlConfidence": 60,
  "tags": [
    { "name": "nodejs" },
    { "name": "github" },
    { "name": "nestjs" }
  ]
}
```

#### Get Bookmarks (with filtering)
```bash
GET /bookmarks?userId=user-id&category=technology&page=1&limit=20
GET /bookmarks?userId=user-id&tag=nodejs
GET /bookmarks?userId=user-id&isFavorite=true
GET /bookmarks?userId=user-id&search=nestjs
```

#### Get Single Bookmark
```bash
GET /bookmarks/:id?userId=user-id
```

#### Update Bookmark
```bash
PATCH /bookmarks/:id?userId=user-id
Content-Type: application/json

{
  "title": "Updated Title",
  "isFavorite": true,
  "tags": ["nodejs", "typescript"]
}
```

#### Delete Bookmark
```bash
DELETE /bookmarks/:id?userId=user-id
```

#### Add Tag to Bookmark
```bash
POST /bookmarks/:id/tags?userId=user-id
Content-Type: application/json

{
  "tagName": "new-tag"
}
```

#### Remove Tag from Bookmark
```bash
DELETE /bookmarks/:id/tags/:tagId?userId=user-id
```

### Tags

#### Create Tag
```bash
POST /tags
Content-Type: application/json

{
  "name": "nodejs",
  "color": "#6366f1"
}
```

#### Get All Tags
```bash
GET /tags
```

#### Update Tag
```bash
PATCH /tags/:id
Content-Type: application/json

{
  "name": "node-js",
  "color": "#ff0000"
}
```

#### Delete Tag
```bash
DELETE /tags/:id
```

## ML Classification

### Categories

The ML service classifies bookmarks into these categories:

1. **technology** - Programming, software, developer tools
2. **news** - News sites, current events
3. **social** - Social media platforms
4. **entertainment** - Videos, music, movies
5. **shopping** - E-commerce sites
6. **education** - Learning platforms, courses
7. **reference** - Documentation, wikis

### Classification Logic

The classifier uses rule-based matching:

- **Domain matching** (60% base confidence)
  - Recognizes popular domains (github.com → technology)
- **URL keyword matching** (10% per match, max 30%)
  - Scans URL for category keywords
- **Title keyword matching** (10% per match, max 30%)
  - Analyzes title for relevant terms
- **Description keyword matching** (5% per match, max 20%)
  - Checks description if provided

If confidence < 10%, category defaults to "uncategorized".

### Tag Suggestion

Tags are automatically generated from:
- Domain name (e.g., "github" from github.com)
- Meaningful words from title (3+ characters, excluding common words)
- Maximum 5 tags suggested per bookmark

### Direct ML Service Usage

You can also call the ML service directly:

```bash
curl -X POST http://localhost:5000/classify \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://github.com/nestjs/nest",
    "title": "NestJS Framework",
    "description": "Progressive Node.js framework"
  }'

# Response:
{
  "category": "technology",
  "confidence": 60,
  "suggested_tags": ["github", "nestjs", "framework"]
}
```

## Database Schema

### Users
```sql
- id (UUID, PK)
- email (unique)
- password_hash
- name
- created_at
- updated_at
```

### Bookmarks
```sql
- id (UUID, PK)
- url (max 2048 chars)
- title (max 255 chars)
- description (text)
- favicon (optional)
- is_favorite (boolean, default false)
- ml_category (from ML service)
- ml_confidence (decimal)
- user_id (FK to users)
- created_at
- updated_at
```

### Tags
```sql
- id (UUID, PK)
- name (unique, lowercase)
- color (hex, default #6366f1)
- created_at
```

### Relationships
- User → Bookmarks (1:N, cascade delete)
- Bookmark ↔ Tags (N:M via bookmark_tags junction table)

## Development

### Running Backend Locally

```bash
cd backend
npm install
npm run start:dev
```

Environment variables:
```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=bookmarks
ML_SERVICE_URL=http://localhost:5000
NODE_ENV=development
```

### Running ML Service Locally

```bash
cd ml-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 5000
```

### Running Tests

```bash
cd backend
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:cov      # With coverage
```

## pgAdmin Access

1. Open http://localhost:8080
2. Login:
   - Email: admin@bookwise.com
   - Password: admin
3. Add server:
   - Name: BookWise DB
   - Host: db
   - Port: 5432
   - Database: bookmarks
   - Username: postgres
   - Password: postgres

## Project Structure

```
bookwise/
├── backend/                    # NestJS API service
│   ├── src/
│   │   ├── main.ts            # Application entry point
│   │   ├── app.module.ts      # Root module
│   │   ├── config/            # Configuration files
│   │   └── modules/
│   │       ├── users/         # User management
│   │       ├── bookmarks/     # Bookmark CRUD + ML
│   │       ├── tags/          # Tag management
│   │       └── ml/            # ML service client
│   ├── Dockerfile
│   └── package.json
│
├── ml-service/                # Python FastAPI service
│   ├── app/
│   │   ├── main.py           # FastAPI app
│   │   ├── classifier.py     # Rule-based classifier
│   │   └── models.py         # Pydantic models
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml         # Multi-service orchestration
└── README.md
```

## Error Handling

### ML Service Failure

If the ML service is unavailable or times out (>5s), the bookmark creation will still succeed with fallback values:

```json
{
  "mlCategory": "uncategorized",
  "mlConfidence": 0,
  "suggested_tags": []
}
```

This ensures the system remains functional even during ML service downtime.

### Validation Errors

All DTOs use class-validator decorators:
- Invalid URLs rejected
- Required fields enforced
- Email format validated
- Hex color format validated

### User Isolation

All bookmark operations require userId and automatically filter results:
- Users cannot access other users' bookmarks
- Attempting to access another user's bookmark returns 404

## Production Considerations

This is a demo application. For production use, consider:

1. **Security**:
   - Implement proper authentication (JWT, OAuth)
   - Hash passwords with bcrypt
   - Add rate limiting
   - Enable HTTPS
   - Add input sanitization

2. **Database**:
   - Use migrations instead of synchronize
   - Add database indexes
   - Set up backup strategy
   - Connection pooling tuning

3. **Monitoring**:
   - Add logging (Winston, Pino)
   - Implement health checks
   - Set up APM (Application Performance Monitoring)
   - Add metrics collection

4. **Scalability**:
   - Use Redis for caching
   - Add message queue for ML processing
   - Load balance multiple backend instances
   - CDN for static assets

## License

MIT

## Contributing

Contributions welcome! Please open an issue or submit a pull request.
