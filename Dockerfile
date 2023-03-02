###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine As development

WORKDIR /app

# Copy configuration files
COPY tsconfig*.json ./
COPY package*.json ./

# Install dependencies from package-lock.json, see https://docs.npmjs.com/cli/v7/commands/npm-ci
RUN yarn install --frozen-lockfile

# Copy application sources (.ts, .tsx, js)
COPY src/ src/

# Build application (produces dist/ folder)
RUN yarn build

###################
# PRODUCTION
###################

FROM node:18-alpine As production

WORKDIR /app

# Copy dependencies files
COPY package*.json ./

# Install runtime dependecies (without dev/test dependecies)
RUN yarn install --frozen-lockfile --production

# Copy production build
COPY --from=development /app/dist/ ./dist/

# Expose application port
EXPOSE 3000

# Start application
CMD [ "node", "dist/main.js" ]