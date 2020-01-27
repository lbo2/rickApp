FROM node:12

COPY package*.json ./

RUN npm ci -qy

COPY . .

EXPOSE 8080

CMD ["npm", "start"]