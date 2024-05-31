# Use nginx to serve static files
FROM nginx:stable-alpine

# Copy built frontend files to nginx html directory
COPY ./dist /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
