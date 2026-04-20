.PHONY: help build up down restart logs test clean ps health

help:
	@echo "Available commands:"
	@echo "  build     - Build all Docker images"
	@echo "  up        - Start all services"
	@echo "  down      - Stop all services"
	@echo "  restart   - Restart all services"
	@echo "  logs      - Show service logs"
	@echo "  ps        - Show running containers"
	@echo "  health    - Check service health"
	@echo "  test      - Run tests"
	@echo "  clean     - Remove volumes and images"

build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

restart: down up

logs:
	docker compose logs -f

ps:
	docker compose ps

health:
	docker compose ps --format "table {{.Name}}\t{{.Status}}"
	curl -s http://localhost/health
	curl -s http://localhost/api/health

test:
	cd backend && pytest -q
	cd frontend && npm run test:run

clean:
	docker compose down -v
	docker image prune -f