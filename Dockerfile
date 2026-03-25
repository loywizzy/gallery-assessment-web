# Build frontend
FROM node:24-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Serve via NGINX
FROM nginx:alpine

# Copy built assets to NGINX default directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom NGINX configuration to handle reverse proxy and React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
