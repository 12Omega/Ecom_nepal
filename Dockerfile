# VulnShop Backend Dockerfile
# This Dockerfile contains intentionally insecure configurations for educational purposes

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Create non-root user (but with weak permissions for vulnerabilities)
RUN addgroup -g 1001 -S vulnshop && \
    adduser -S vulnshop -u 1001

# Copy package files
COPY package*.json ./

# Install dependencies with intentionally permissive settings
RUN npm install --production=false

# Copy application code
COPY . .

# Create upload directories with weak permissions (vulnerability)
RUN mkdir -p uploads/products uploads/users uploads/logs && \
    chmod 777 uploads/ -R

# Expose port
EXPOSE 5000

# Set environment variables (some intentionally insecure)
ENV NODE_ENV=development
ENV PORT=5000

# Switch to vulnshop user (but still has elevated permissions - vulnerability)
USER vulnshop

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start the application
CMD ["npm", "start"]