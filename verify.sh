#!/bin/bash

echo "🔍 BookWise Verification Script"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Docker
echo "Checking Docker..."
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker is installed"
else
    echo -e "${RED}✗${NC} Docker is not installed"
    exit 1
fi

# Check Docker Compose
echo "Checking Docker Compose..."
if command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker Compose is installed"
else
    echo -e "${RED}✗${NC} Docker Compose is not installed"
    exit 1
fi

echo ""
echo "Starting services..."
docker-compose up -d

echo ""
echo "Waiting for services to be ready..."
sleep 15

echo ""
echo "Checking service health..."

# Check Backend
echo -n "Backend API: "
if curl -s http://localhost:3001/api > /dev/null; then
    echo -e "${GREEN}✓ Running${NC}"
else
    echo -e "${RED}✗ Not responding${NC}"
fi

# Check ML Service
echo -n "ML Service: "
response=$(curl -s http://localhost:5000/health)
if echo "$response" | grep -q "healthy"; then
    echo -e "${GREEN}✓ Healthy${NC}"
else
    echo -e "${RED}✗ Unhealthy${NC}"
fi

# Check PostgreSQL
echo -n "PostgreSQL: "
if docker-compose exec -T db pg_isready -U postgres > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Ready${NC}"
else
    echo -e "${RED}✗ Not ready${NC}"
fi

echo ""
echo "Testing ML Classification..."
response=$(curl -s -X POST http://localhost:5000/classify \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://github.com/nestjs/nest",
    "title": "NestJS Framework",
    "description": "Progressive Node.js framework"
  }')

if echo "$response" | grep -q "technology"; then
    echo -e "${GREEN}✓${NC} ML classification working: $(echo $response | grep -o '"category":"[^"]*"')"
else
    echo -e "${RED}✗${NC} ML classification failed"
fi

echo ""
echo "Testing Bookmark Creation..."

# First create a user
user_response=$(curl -s -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }')

user_id=$(echo $user_response | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -n "$user_id" ]; then
    echo -e "${GREEN}✓${NC} User created: $user_id"

    # Create a bookmark
    bookmark_response=$(curl -s -X POST http://localhost:3001/api/bookmarks \
      -H "Content-Type: application/json" \
      -d "{
        \"url\": \"https://github.com/nestjs/nest\",
        \"title\": \"NestJS Framework\",
        \"description\": \"A progressive Node.js framework\",
        \"userId\": \"$user_id\"
      }")

    if echo "$bookmark_response" | grep -q "mlCategory"; then
        category=$(echo $bookmark_response | grep -o '"mlCategory":"[^"]*"' | cut -d'"' -f4)
        confidence=$(echo $bookmark_response | grep -o '"mlConfidence":[0-9]*' | cut -d':' -f2)
        echo -e "${GREEN}✓${NC} Bookmark created with ML: category=$category, confidence=$confidence%"
    else
        echo -e "${RED}✗${NC} Bookmark creation failed"
    fi
else
    echo -e "${RED}✗${NC} User creation failed"
fi

echo ""
echo "================================"
echo "Verification complete!"
echo ""
echo "Access points:"
echo "  Backend API:  http://localhost:3001/api"
echo "  ML Service:   http://localhost:5000"
echo "  pgAdmin:      http://localhost:8080"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"
