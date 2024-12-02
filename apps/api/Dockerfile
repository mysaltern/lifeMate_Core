# Base image
FROM node:18-alpine 

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build the application
RUN npm run build


EXPOSE 3000

# Start the application
CMD ["node", "dist/apps/api/main.js"]
