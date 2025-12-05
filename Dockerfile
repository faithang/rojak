# FROM gdssingapore/airbase:node-24-builder AS builder
# COPY package.json .
# RUN npm install
# COPY . ./
# RUN npm run build

# FROM gdssingapore/airbase:nginx-1.28
# USER app
# COPY --from=builder --chown=app:app /app/build/ .

FROM gdssingapore/airbase:node-24-builder AS builder
COPY package.json .
RUN npm install
COPY . ./
RUN npm run build

FROM gdssingapore/airbase:nginx-1.28
USER app
COPY --from=builder --chown=app:app /app/build/ .
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf