FROM node:18-alpine

WORKDIR /app

# Install basic build tools for tesseract.js
RUN apk add --no-cache python3 g++ make

COPY ./app/package*.json ./
RUN npm install

COPY ./app .

EXPOSE 3000
CMD ["npm", "start"]
