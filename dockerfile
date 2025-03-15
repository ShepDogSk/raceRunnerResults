# Base image
FROM node:20.11

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package.json package-lock.json ./

# Install app dependencies
RUN npm install

COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/dist ./dist
# COPY package.json .

# FROM node:20.11

#WORKDIR /app

# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/dist ./dist
# COPY package.json .

CMD ["node", "dist/main"]

# Expose the port on which the app will run
EXPOSE 3000

# Start the server using the production build


