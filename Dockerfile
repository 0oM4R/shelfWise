# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install 

# Copy the rest of the app
COPY . .

# Expose the port your app runs on (change if not 3000)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
