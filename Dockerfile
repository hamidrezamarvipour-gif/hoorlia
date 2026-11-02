FROM node:22-alpine
WORKDIR /app

ENV NODE_ENV=production

RUN npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm config set fetch-timeout 300000 \
    && npm config set registry https://registry.npmmirror.com/

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]