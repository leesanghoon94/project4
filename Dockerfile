FROM node:14-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY backend/app.js .
COPY routes ./routes

RUN npm run build

CMD [ "npm", "start" ]
