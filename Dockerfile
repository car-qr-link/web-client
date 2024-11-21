# Use the official Node.js image as the base image
FROM node:20-alpine as base

# Set the working directory inside the container
WORKDIR /app

ARG NPM_TOKEN


FROM base as builder

RUN npm config set '//npm.pkg.github.com/:_authToken' $NPM_TOKEN

# Copy package.json and package-lock.json to the working directory
COPY .npmrc ./
COPY package*.json ./


# Install the project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the NestJS application
RUN npm run build

FROM base as deps

RUN npm config set '//npm.pkg.github.com/:_authToken' $NPM_TOKEN

# Copy package.json and package-lock.json to the working directory
COPY .npmrc ./
COPY package*.json ./

# Install the project dependencies
RUN npm install --omit=dev


FROM base as production

# Set the environment
ENV NODE_ENV=production

COPY package*.json ./

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY views ./views

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
ENTRYPOINT ["node", "dist/main.js"]
