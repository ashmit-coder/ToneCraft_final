FROM node:alpine
RUN apk update \
    && apk add --no-cache gcc g++ python3 python3-dev
ENV CC=/usr/bin/gcc
ENV CXX=/usr/bin/g++
WORKDIR /ToneCraft
COPY package.json /ToneCraft
RUN npm install
COPY . /ToneCraft
EXPOSE 5000
CMD ["npm", "start"]
