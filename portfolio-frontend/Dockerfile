#1. Build Angular
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm ci && npm run build -- --configuration=production 


#2. Serve project with reverse proxy nginx
FROM nginx:alpine
COPY --from=build /app/dist/romdhani-void /usr/share/nginx/html
EXPOSE 80