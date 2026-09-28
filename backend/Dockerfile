FROM node:24-alpine

WORKDIR /app

# Install tools required to build better-sqlite3
RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p data

EXPOSE 5000

CMD ["npm", "start"]