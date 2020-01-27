# Stage 1 - the build process
FROM node:12 as build-deps
COPY package*.json ./
RUN npm ci -qy
COPY . .
RUN npm run build:prod

# Stage 2 - the production environment
FROM nginx:1.12-alpine
COPY --from=build-deps /dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]