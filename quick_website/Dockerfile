FROM node:18-alpine

WORKDIR /app

COPY ./ .

RUN npm install
RUN npx vue-cli-service build
RUN npm install -g serve


ENTRYPOINT [ "/bin/sh", "-c" ]
CMD [ "npx serve -s dist -p 7000" ]


