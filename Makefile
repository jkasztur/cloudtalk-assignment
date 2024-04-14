.PHONY: up stop down sh

SCOPE = product

default:
	cat Makefile

up:
	docker-compose up --force-recreate

up-services:
	docker-compose up postgres redis amqp

up-apps:
	docker-compose up product review-processing-1 review-processing-2

stop:
	docker-compose stop

down:
	docker-compose down

sh:
	docker-compose run --rm app sh
