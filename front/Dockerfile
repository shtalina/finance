FROM node:16-alpine

RUN npm install -g nodemon

WORKDIR /front
COPY . .

RUN npm install

EXPOSE 3000
CMD ["npm", "run", "dev"]