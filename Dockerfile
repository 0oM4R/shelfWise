FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install 


# Use APP_PORT if set, otherwise default to 3000

ARG APP_PORT=3000
ENV APP_PORT=${APP_PORT}
EXPOSE ${APP_PORT}

COPY . .

CMD ["npm", "start"]
