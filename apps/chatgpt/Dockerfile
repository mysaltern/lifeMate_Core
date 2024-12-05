# Use a smaller base image for building
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /usr/src/app
COPY ../../package*.json ./
# Copy package files for dependency installation
COPY package*.json ./

# Install all dependencies, including development dependencies, for building
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the application
RUN npm run build


# Use a lightweight runtime image for production
FROM node:18-alpine  AS development

# Set working directory
WORKDIR /usr/src/app

# Copy only built files and production dependencies
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Expose application port
EXPOSE 3001

# Start the application
CMD ["node", "dist/apps/chatgpt/main.js"]
