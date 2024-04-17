
# Technology Overview
- [Turbo](https://turbo.build/repo) to setup monorepo
- [Nest.JS](https://nestjs.com/) framework
- Node v20.9.0
- Postgres DB + TypeORM
- Redis for caching and locking
- RabbitMQ as messaging broker
- ~~Github Actions~~ (planned)

# How to start
```
# Use node v20.9.0
nvm use

# Install all packages
npm install

# Start project
# (first start may take few minutes, because of docker build)
make up
```

# Product App
Product app handles all comunication with database and with client. 

### Queues
On created/updated/deleted review send message to `review-processing` queue.
At first I wanted all communication through RabbitMQ to go through exchange and only if there is exchange-queue binding, the message would get to consumer. But that took much time because amqp microservice setup is not perfect in NestJS. So I chose to use queues directly

There is also consumer on `product` queue where the app listens for ranking `average.updated` event

### Cron job
Received average updates are stored in redis and ony updated in DB once every minute (could be setup by env, currently hardcoded). Db update is done in transaction

### API
API docs are available on http://localhost:3002/api with started project app. Documentation is done with Swagger. All endpoints can be tried on that link for testing.

# Review Processing App
For local development it's setup in two instances.

Handles all calculations related to rating average. The main idea is that for each product we will store review count and rating sum in redis. Then on different events we will modify these values:
- created -> count +=1, sum += rating
- updated -> sum += (newrating - oldrating)
- deleted -> count -=1, sum -= rating

That way we can always calculate current rating average and we don't need to cache all reviews. All we need are the sums and counts. Also, in case its the first review(or after long this) we always fetch current count from product

### Locking
There is implemented redis lock by productId. So we always process only one event for that product and don't run into any race conditions

### TODO: Lua scripts
It should be possible to use Lua script directly in redis, instead of two separate redis call. If used, we would not need redis locks, as the update would happen atomically

# What wasn't done
- CI setup
- Tests - only E2E tests for `/products` endpoints. Rest wasn't done because of time constraints
- Security - endpoints are public. Should accept some access_token or api key. Not done, because of of scope
- Shared package for shared types
- Pagination for reviews list. Currently only done for `GET /products`
- Caching of GET endpoints in Redis. Currently cache is used only for rating average calculations. But should be easy to add by redis and invalidate on update/delete
- Use Lua script in review-processing
