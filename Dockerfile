FROM node:lts-alpine

RUN npm config set registry https://registry.npmmirror.com

RUN npm install pnpm -g

RUN npm install ts-node -g

WORKDIR /bh

COPY . /bh

RUN pnpm install

RUN pnpm run build

RUN pnpm run build:back

EXPOSE 5600

CMD ["node", "./dist/back/app.js"]
