# E-commerce Application

A modern e-commerce web application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- User authentication and authorization
- Product catalog with search and filtering
- Shopping cart functionality
- Order management
- Admin dashboard
- Payment processing integration
- Responsive design

## Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB
- Git

### Installation
```bash
# Clone and setup
git clone <repository-url>
cd ecommerce-app
npm install
cd client && npm install && cd ..

# Start application
npm run dev
```

### Docker Setup (Recommended)
```bash
# Build and start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

## Project Structure

```
ecommerce-app/
├── client/          # React frontend application
├── server/          # Express.js backend API
├── database/        # Database configuration and initialization
├── nginx/           # Reverse proxy configuration
├── scripts/         # Setup and utility scripts
├── uploads/         # File uploads directory
├── .env            # Environment configuration
├── docker-compose.yml # Docker orchestration
└── README.md       # This file
```

## Available Scripts

### Development
- `npm run dev` - Start both frontend and backend
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run verify-env` - Check environment setup

### Database
- `npm run init-db` - Initialize database schema
- `npm run seed-db` - Populate with sample data

### Docker
- `npm run docker:build` - Build Docker images
- `npm run docker:up` - Start Docker services
- `npm run docker:down` - Stop Docker services
- `npm run docker:logs` - View Docker logs

### Production
- `npm run build` - Build frontend for production
- `npm start` - Start production server
- `npm run ssl:setup` - Generate SSL certificates

## Configuration

Copy `.env.example` to `.env` and configure:

```bash
# Application
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce

# Security
JWT_SECRET=your-jwt-secret-key
SESSION_SECRET=your-session-secret-key

# Admin Account
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure-admin-password
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/search` - Search products
- `POST /api/products` - Create product (admin)

### Cart
- `GET /api/cart/:userId` - Get user cart
- `POST /api/cart/:userId/add` - Add item to cart
- `PUT /api/cart/:userId/update/:productId` - Update cart item
- `DELETE /api/cart/:userId/remove/:productId` - Remove from cart

### Orders
- `POST /api/checkout/initiate/:userId` - Initiate checkout
- `POST /api/checkout/process/:checkoutId` - Process payment

## Technology Stack

- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens, bcrypt
- **File Upload**: Multer
- **Payment**: Stripe integration
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx

## Development

### Running Tests
```bash
npm test
```

### Code Style
- ESLint for JavaScript linting
- Prettier for code formatting

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure secure JWT secrets
- [ ] Enable SSL/HTTPS
- [ ] Set up proper database credentials
- [ ] Configure CORS for production domain
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy

### Docker Production
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## Security

This application implements security best practices:
- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- CORS configuration
- Security headers with Helmet
- Rate limiting
- File upload restrictions

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Check the documentation
- Review the troubleshooting guide
- Submit an issue on GitHub


