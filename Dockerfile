# NOTE: If the BASE_URL env var is set to something like "http://localhost:9009"
# then the image should be started using the same port like:
#    docker run -t -p 9009:80 -d smartonfhir/smart-launcher:latest

FROM node:14

WORKDIR /app

ENV NODE_ENV      "production"
ENV LAUNCHER_PORT "80"
ENV BASE_URL      "http://localhost:9009"

# Which FHIR servers to use
ENV FHIR_SERVER_R2 "https://r2.smarthealthit.org"
ENV FHIR_SERVER_R3 "https://r3.smarthealthit.org"
ENV FHIR_SERVER_R4 "https://r4.smarthealthit.org"

# The names of the config files corresponding to the FHIR servers above
ENV PICKER_CONFIG_R2 "r2"
ENV PICKER_CONFIG_R3 "r3"
ENV PICKER_CONFIG_R4 "r4"

ENV PICKER_ORIGIN "https://patient-browser.smarthealthit.org"

# Install and cache
COPY package.json      /tmp/package.json
COPY package-lock.json /tmp/package-lock.json
RUN cd /tmp && npm install --production
RUN mv /tmp/node_modules /app/node_modules

COPY . .

# You must use -p 9009:80 when running the image
EXPOSE 80 

CMD ["node", "./src/index.js"]