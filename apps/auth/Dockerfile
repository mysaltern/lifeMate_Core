# Builder Stage
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Install necessary build tools for bcrypt and other native modules
RUN apk add --no-cache make g++ python3

# Copy root-level package files
COPY package*.json ./

# Copy `auth` service package files
COPY apps/auth/package*.json ./apps/auth/

# Copy `common` library for shared modules
COPY libs/common ./libs/common

# Copy TypeScript configuration files
COPY tsconfig*.json ./

# Install all dependencies
RUN npm install

# Rebuild bcrypt for the target architecture
RUN npm rebuild bcrypt --build-from-source

# Copy the rest of the source code
COPY apps/auth ./apps/auth

# Build the application
RUN npm run build

# Development Stage
FROM node:18-alpine AS development

WORKDIR /usr/src/app

# Copy built application and dependencies
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

EXPOSE 3002

# Start the application
CMD ["node", "dist/apps/auth/main.js"]
