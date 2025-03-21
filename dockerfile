# Base image
FROM node:20.11 AS builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package.json package-lock.json ./

# Install app dependencies
RUN npm install

COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

FROM node:20.11 AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/dist ./client/dist
COPY package.json .

CMD ["node", "dist/main"]

# Expose the port on which the app will run
EXPOSE 3000

# Start the server using the production build


