FROM node:alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY tsconfig.json ./
COPY prisma prisma
COPY ./ ./
RUN npm run build
EXPOSE 4000

# COPY startup.sh .
# RUN ./startup.sh
CMD ["npm","start"]
