import fs from "fs";

export function writeRootDockerfile() {
  fs.writeFileSync(
    "Dockerfile",
    `
# Stage 1: Node.js Build Stage
FROM node:20-slim AS builder

RUN apt-get update && apt-get install -y curl

# Set the working directory for Node.js
WORKDIR /app

# Copy the root package.json and yarn.lock first (to take advantage of Docker caching)
COPY package.json package-lock.json turbo.json ./ 

# Copy the frontend and backend specific package.json files
COPY frontend ./frontend
COPY backend ./backend

# Install dependencies for the entire monorepo
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Build both the frontend and backend
RUN npm run build

# Stage 2: Production Stage
FROM node:20-slim

# Set the working directory for the final production stage
WORKDIR /app

# Install curl (needed for downloading AWS RDS cert)
# RUN apt-get update && apt-get install -y curl

# Copy Node.js application files from builder stage
COPY package.json package-lock.json ./ 
RUN npm install

# Copy node_modules from the builder stage for Node.js
COPY --from=builder /app/node_modules /app/node_modules

# **Copy the entire backend source (including migrations and seeders) for Node.js**
COPY --from=builder /app/backend /app/backend
# COPY --from=builder /app/backend/public /app/backend/dist/public

# Copy the build artifacts from the builder stage for Node.js
COPY --from=builder /app/frontend/dist /app/frontend/dist

# Copy environment variables and additional assets (e.g., .env) for Node.js
COPY --from=builder /app/.env /app/.env

# Download the AWS RDS certificate bundle for Node.js app
# RUN curl -L https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem -o /tmp/rds-ca_bundle.pem && \
#     cp /tmp/rds-ca_bundle.pem /app/backend/dist/rds-ca_bundle.pem && \
#     cp /tmp/rds-ca_bundle.pem /app/backend/src/rds-ca_bundle.pem && \
#     rm /tmp/rds-ca_bundle.pem

# Set environment variables for production
ENV NODE_ENV=prod

# Expose the ports for both Node.js and .NET apps (e.g., 5000 for Node.js, 8080 for .NET)
EXPOSE 5000

# Command to run both Node.js and .NET applications
CMD cd backend && \
    # npx sequelize-cli db:migrate --env production && \
    echo "Starting Backend Server for Node.js..." && \
    node index.js

    `
  );
}
