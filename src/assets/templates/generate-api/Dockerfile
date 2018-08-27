---
layout: false
rename:
  basename: './Dockerfile'
---
FROM node:carbon as linter
USER 0
COPY . /app
WORKDIR /app
RUN yarn install
RUN yarn lint

FROM node:carbon as transpiler
COPY --from=linter /app /app
WORKDIR /app
RUN yarn build

FROM node:carbon as tester
COPY --from=transpiler /app /app
COPY --from=transpiler /app/dist /app/dist
COPY --from=transpiler /app/node_modules /app/node_modules
WORKDIR /app
RUN echo "NODE_ENV=test" > .env \
  && echo "PORT=9002" >> .env \
  && echo "ENABLE_LOGGING=true" >> .env \
  && echo "DEBUG=" >> .env \
  && echo "DB_USERNAME='tereo'" \
  && echo "DB_PASSWORD='tereo'" \
  && echo "DB_HOST='127.0.0.1'" \
  && echo "DB_PORT=27017" \
  && echo "DB_NAME='tereo-test'" \
  && yarn test

FROM node:carbon as builder
COPY --from=transpiler /app /app
COPY --from=transpiler /app/node_modules /app/node_modules
WORKDIR /app
RUN yarn build:lib && yarn build:assets

FROM node:carbon
LABEL Author="Rémi Becheras <r.becheras@sirap.fr>"
RUN mkdir /app
COPY --from=builder /app/dist /app/dist
WORKDIR /app
COPY package.json .
COPY index.js .
RUN yarn install --production
CMD [ "yarn start" ]
