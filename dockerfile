# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy files
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Build and start the app
RUN npm run build
CMD ["npm", "run", "start"]
