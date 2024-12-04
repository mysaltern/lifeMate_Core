# Builder Stage
FROM node:18-alpine AS builder

WORKDIR /usr/src/app
COPY ../../package*.json ./
# Install necessary build tools
RUN apk add --no-cache make g++ python3

# Install all dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Production Stage
FROM node:18-alpine AS Development

WORKDIR /usr/src/app

# Copy built app and dependencies
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/apps/auth/main.js"]
