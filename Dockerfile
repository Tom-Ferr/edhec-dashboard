FROM node:18-alpine

WORKDIR /app

# Install basic build tools for tesseract.js
RUN apk add --no-cache python3 g++ make

COPY ./app .

RUN npm install


EXPOSE 3000
CMD ["npm", "start"]
