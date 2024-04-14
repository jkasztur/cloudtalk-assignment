FROM node:20.9.0-alpine AS base

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN npm i -g turbo
COPY . .
RUN turbo prune review-processing --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json .
RUN npm clean-install
# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN npx turbo build --filter=review-processing...

FROM base AS runner
WORKDIR /app
# Don't run production as root
COPY --from=installer /app .
CMD node apps/review-processing/dist/main.js


