FROM node:24-alpine3.21

# Create app directory
WORKDIR /app

# Install bash
RUN apk update && apk add bash

# Install app dependencies
COPY package*.json ./

# node_modules
RUN npm install

# Download wait-for-it
# ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh ./wait-for-it.sh
# RUN chmod +x ./wait-for-it.sh

# Bundle app source
COPY . .

EXPOSE 3001
# CMD [ "/bin/bash", "-c", "./wait-for-it.sh mysql_sopes:3306 -- node index.js" ]
CMD [ "/bin/bash", "-c", "npm start" ]