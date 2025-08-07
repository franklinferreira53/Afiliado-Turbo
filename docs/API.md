# API Documentation - Afiliado Turbo

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "minhasenha123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /auth/login
Login user.

**Request Body:**
```json
{
  "email": "joao@example.com",
  "password": "minhasenha123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "settings": {}
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### GET /auth/profile
Get user profile (protected).

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "created_at": "2024-01-15T10:30:00Z",
    "settings": {
      "voice_preference": "female",
      "content_frequency": 3,
      "preferred_platforms": ["instagram", "facebook"],
      "categories": ["electronics", "home"]
    }
  }
}
```

### Products

#### GET /products/search
Search products from Amazon and Shopee.

**Query Parameters:**
- `query` (required): Search term
- `source` (optional): 'amazon', 'shopee', or 'all'
- `category` (optional): Product category
- `limit` (optional): Number of results (default: 20)

**Response:**
```json
{
  "products": [
    {
      "title": "Smartphone Samsung Galaxy A54",
      "description": "Smartphone com excelente custo-benefício",
      "price": 1299.99,
      "original_price": 1599.99,
      "image_url": "https://example.com/image.jpg",
      "product_url": "https://shopee.com.br/product/1",
      "affiliate_link": "https://shopee.com.br/product/1?affiliate=demo",
      "source": "shopee",
      "category": "electronics",
      "rating": 4.5,
      "reviews_count": 2847,
      "popularity_score": 95
    }
  ],
  "count": 1,
  "cached": false
}
```

#### GET /products/trending
Get trending products.

**Query Parameters:**
- `limit` (optional): Number of results (default: 20)

**Response:** Same as search endpoint.

#### POST /products
Save a product (protected).

**Request Body:**
```json
{
  "title": "Product Title",
  "description": "Product description",
  "price": 99.99,
  "original_price": 149.99,
  "image_url": "https://example.com/image.jpg",
  "product_url": "https://example.com/product",
  "affiliate_link": "https://example.com/product?affiliate=123",
  "source": "amazon",
  "category": "electronics",
  "rating": 4.2,
  "reviews_count": 150,
  "popularity_score": 85
}
```

### Content Generation

#### POST /content/generate
Generate AI content (protected).

**Request Body:**
```json
{
  "product_id": 1,
  "type": "social_post",
  "platform": "instagram",
  "style": "modern"
}
```

**Response:**
```json
{
  "message": "Content generated successfully",
  "content": {
    "id": 1,
    "title": "Generated social_post for Product Title",
    "type": "social_post",
    "status": "draft",
    "ai_generated_data": {
      "description": "🔥 Incredible deal on Product Title!...",
      "hashtags": ["#deal", "#shopping", "#affiliate"],
      "cta": "🛒 Click the link to grab yours now!",
      "fullPost": "🔥 Incredible deal...\n\n🛒 Click the link...\n\n#deal #shopping #affiliate"
    }
  }
}
```

#### GET /content
Get user content (protected).

**Query Parameters:**
- `type` (optional): Filter by content type
- `status` (optional): Filter by status
- `limit` (optional): Number of results (default: 20)

### Social Media

#### POST /social/publish
Publish content to social media (protected).

**Request Body:**
```json
{
  "content_id": 1,
  "platforms": ["instagram", "facebook"],
  "access_tokens": {
    "instagram": "instagram-token",
    "facebook": "facebook-token"
  },
  "page_id": "facebook-page-id",
  "schedule_time": "2024-01-16T15:00:00Z"
}
```

#### POST /social/validate-token
Validate social media token (protected).

**Request Body:**
```json
{
  "platform": "instagram",
  "access_token": "your-token"
}
```

### Analytics

#### GET /analytics/dashboard
Get dashboard statistics (protected).

**Query Parameters:**
- `date_range` (optional): '24h', '7d', '30d', '90d', '1y'

**Response:**
```json
{
  "date_range": "30d",
  "stats": {
    "total_clicks": 1247,
    "total_views": 8932,
    "total_conversions": 89,
    "total_revenue": 4567.89,
    "ctr": 13.96,
    "conversion_rate": 7.14
  }
}
```

#### POST /analytics/track
Track an event (protected).

**Request Body:**
```json
{
  "event_type": "click",
  "product_id": 1,
  "content_id": 1,
  "source": "instagram",
  "conversion_value": 99.99,
  "metadata": {
    "duration": 30
  }
}
```

## Error Responses

All endpoints may return these error responses:

#### 400 Bad Request
```json
{
  "error": "Validation error",
  "details": ["Email is required", "Password must be at least 6 characters"]
}
```

#### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

#### 403 Forbidden
```json
{
  "error": "Invalid or expired token"
}
```

#### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```