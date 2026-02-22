# Variables
COMPOSE_DEV = docker-compose -f docker-compose.yml -f docker-compose.dev.yml
COMPOSE_PROD = docker-compose -f docker-compose.yml -f docker-compose.prod.yml
GEOIP_DIR = backend/src/main/resources/geoip
GEOIP_FILE = $(GEOIP_DIR)/GeoLite2-City.mmdb
GEOIP_URL = "https://github.com/P3TERX/GeoLite.mmdb/releases/latest/download/GeoLite2-City.mmdb"

# Default target
.DEFAULT_GOAL := help

help:
	@echo "------------------------------------------------------------------------"
	@echo "Shortenit Project Management Commands"
	@echo "------------------------------------------------------------------------"
	@grep -E '^[a-zA-Z_/.-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo "------------------------------------------------------------------------"

# env file check
.env:
	@echo "- .env file not found!"
	@cp .env.template .env
	@echo "- Created .env from .env.template."
	@echo "- ACTION REQUIRED: Please edit your .env file and fill in the required values."
	@exit 1

# GeoIP Database Preparation
geoip-prepare: ## Check and download GeoIP database if missing
	@if [ ! -d "$(GEOIP_DIR)" ]; then \
		echo "Creating directory $(GEOIP_DIR)..."; \
		mkdir -p $(GEOIP_DIR); \
	fi
	@if [ ! -f "$(GEOIP_FILE)" ]; then \
		echo "Downloading GeoIP database..."; \
		curl -L -o $(GEOIP_FILE) $(GEOIP_URL); \
	else \
		echo "GeoIP database already exists."; \
	fi

# Dev Commands
dev-up: .env geoip-prepare ## Start development environment (with build)
	$(COMPOSE_DEV) up --build -d

dev-down: ## Stop development environment
	$(COMPOSE_DEV) down

dev-down-cleanup: ## Stop dev and remove volumes/orphans
	$(COMPOSE_DEV) down --volumes --remove-orphans

# Prod Commands
prod-up: .env ## Start production environment
	$(COMPOSE_PROD) up -d

prod-down: ## Stop production environment
	$(COMPOSE_PROD) down