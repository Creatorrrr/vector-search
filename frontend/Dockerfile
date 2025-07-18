FROM node:22

WORKDIR /app

# Copy package files
COPY package*.json ./

# Remove package-lock.json to force fresh install
RUN rm -f package-lock.json

# Install dependencies with force to rebuild native modules
RUN npm install --force

# Copy source code
COPY . .

# Expose port
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
