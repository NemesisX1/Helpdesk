FROM node:16.14
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 8081
ENTRYPOINT ["node", "app.js"]

# FROM node:13.12.0-alpine

# WORKDIR /usr/src/app

# # Install Dependencies
# COPY package*.json ./

# RUN npm install

# # Copy app source code
# COPY . .

# EXPOSE 8081

# ENTRYPOINT ["npm", "start"]