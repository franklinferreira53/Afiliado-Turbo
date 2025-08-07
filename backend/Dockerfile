# Multi-stage build for production optimization
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./

# Development dependencies
FROM base AS development
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Production dependencies
FROM base AS production-deps
RUN npm ci --only=production && npm cache clean --force

# Production build
FROM node:18-alpine AS production
WORKDIR /app

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy production dependencies
COPY --from=production-deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .

# Create necessary directories
RUN mkdir -p logs uploads && \
    chown -R nodejs:nodejs logs uploads

EXPOSE 3000
USER nodejs

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node --version

CMD ["npm", "start"]