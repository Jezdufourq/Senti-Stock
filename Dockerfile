# Downloading latest node version
FROM node:latest

# Client files
COPY ./client /client
WORKDIR /client
# Installing client dependicies
RUN yarn
RUN yarn global add @quasar/cli
# Building quasar SPA
RUN quasar build

# Server files
COPY ./server /server
WORKDIR /server
# Installing server dependicies
RUN npm i
# Exposing port and running express application
EXPOSE 8000
CMD ["npm", "run", "prod"]
