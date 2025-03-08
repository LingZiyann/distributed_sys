FROM node:14

#create /app folder and set as working directory
WORKDIR /app

COPY httpserver.js .
COPY index.html .
COPY package.json .

RUN npm install

EXPOSE 3000

CMD ["node", "httpserver.js"]