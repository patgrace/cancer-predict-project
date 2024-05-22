FROM node:20
WORKDIR /app
ENV PORT 8080

ENV HOST=0.0.0.0
ENV MODEL_URL=https://storage.googleapis.com/submission-bucket-patricia/model-in-prod/model.json
COPY package*.json ./

RUN npm ci
COPY . .

EXPOSE 8080
CMD [ "npm", "run", "start"]
