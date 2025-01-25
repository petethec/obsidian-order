# API Endpoints Documentation

## Authentication

### POST /auth/signup
Create a new user account.

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "username": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "string",
    "username": "string"
  },
  "session": {
    "access_token": "string",
    "refresh_token": "string"
  }
}
```

### POST /auth/signin
Sign in to an existing account.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:** Same as signup

## Campaigns

### POST /api/campaigns
Create a new campaign.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "type": "corporate_advocacy | refundable_milestone | competitive_innovation | government | fail_forward",
  "funding_goal": "number",
  "duration": "30 | 60 | 90",
  "target": "string",
  "milestones": [{
    "title": "string",
    "date": "string",
    "description": "string"
  }],
  "success_type": "reward | stretch | community",
  "success_description": "string",
  "failure_type": "refund | charity | challenge",
  "failure_description": "string",
  "charity_name": "string?",
  "refund_percentage": "number?"
}
```

**Response:**
```json
{
  "id": "uuid",
  "creator_id": "uuid",
  "status": "draft | active | successful | failed",
  ...campaign_details
}
```

### GET /api/campaigns
List active campaigns.

**Query Parameters:**
- `type`: Filter by campaign type
- `status`: Filter by status
- `creator`: Filter by creator ID
- `page`: Page number
- `limit`: Results per page

**Response:**
```json
{
  "campaigns": [{
    "id": "uuid",
    "title": "string",
    "description": "string",
    "current_amount": "number",
    "funding_goal": "number",
    "creator": {
      "id": "uuid",
      "username": "string"
    },
    ...campaign_details
  }],
  "total": "number",
  "page": "number",
  "pages": "number"
}
```

### GET /api/campaigns/:id
Get campaign details.

**Response:**
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "current_amount": "number",
  "funding_goal": "number",
  "milestones": [{
    "id": "uuid",
    "title": "string",
    "status": "pending | completed | failed"
  }],
  "glass_score": {
    "score": "number",
    "factors": {}
  },
  "creator": {
    "id": "uuid",
    "username": "string",
    "reputation": {
      "score": "number",
      "achievements": []
    }
  }
}
```

## Pledges

### POST /api/campaigns/:id/pledges
Create a new pledge.

**Request Body:**
```json
{
  "amount": "number"
}
```

**Response:**
```json
{
  "id": "uuid",
  "amount": "number",
  "status": "pending",
  "created_at": "string"
}
```

### GET /api/campaigns/:id/pledges
List pledges for a campaign.

**Response:**
```json
{
  "pledges": [{
    "id": "uuid",
    "amount": "number",
    "backer": {
      "username": "string"
    },
    "created_at": "string"
  }]
}
```

## Marketplace

### POST /api/marketplace/listings
Create a marketplace listing.

**Request Body:**
```json
{
  "campaign_id": "uuid",
  "price": "number",
  "legacy_share_enabled": "boolean",
  "legacy_share_discount": "number?",
  "royalty_percentage": "number?",
  "royalty_duration_months": "number?",
  "advisor_role_enabled": "boolean",
  "advisor_engagement_level": "light | moderate | active"
}
```

### POST /api/marketplace/listings/:id/purchase
Purchase a listed campaign.

**Request Body:**
```json
{
  "accept_legacy_share": "boolean",
  "accept_advisor_role": "boolean"
}
```

## Consequences

### POST /api/campaigns/:id/consequences
Request consequence trigger.

**Request Body:**
```json
{
  "type": "success | failure",
  "notes": "string"
}
```

### GET /api/campaigns/:id/consequences
Get consequence status.

**Response:**
```json
{
  "status": "pending | approved | rejected",
  "last_updated": "string"
}
```