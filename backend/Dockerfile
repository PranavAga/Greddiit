FROM node:18.13.0

WORKDIR /backend

COPY package.json .
COPY . . 

RUN npm install

EXPOSE 4000

CMD ["npm","start"]