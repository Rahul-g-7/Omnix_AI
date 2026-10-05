FROM node

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY ./services/auth/package*.json ./services/auth
RUN cd services/auth && npm install

COPY services ./services
COPY shared ./shared

WORKDIR /app/gateway

EXPOSE 8000
CMD [ "npm", "start"]