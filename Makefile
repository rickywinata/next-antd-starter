# Database

.PHONY: gen-migrations
gen-migrations:
	@npx drizzle-kit generate




# Infrastructure

PROJECT_ID_PROD=next-antd-starter
SERVICE_NAME_PROD=next-ant-starter-app
REGION=asia-east1
GIT_COMMIT_SHA := $(shell git describe --always --dirty)

## Production
## 

.PHONY: prod-build
prod-build: PROJECT_ID=$(PROJECT_ID_PROD)
prod-build: SERVICE_NAME=$(SERVICE_NAME_PROD)
prod-build: ENVIRONMENT=production
prod-build: build

.PHONY: prod-deploy
prod-deploy: PROJECT_ID=$(PROJECT_ID_PROD)
prod-deploy: SERVICE_NAME=$(SERVICE_NAME_PROD)
prod-deploy: ENVIRONMENT=production
prod-deploy: deploy

.PHONY: prod-up
prod-up: prod-build prod-deploy


## Shared
## 

.PHONY: build
build:
	@echo "⚠️  Building docker image & pushing it to GCP Container Registry...\n"
	gcloud builds submit \
		--config builders/build.yaml \
		--project $(PROJECT_ID) \
		--region=$(REGION) \
		--substitutions="\
_SERVICE_NAME=$(SERVICE_NAME),\
_ENVIRONMENT=$(ENVIRONMENT)"

.PHONY: deploy
deploy:
	@echo "⚠️  Deploying to GCP Cloud Run...\n"
	gcloud builds submit \
		--config builders/deploy.yaml \
		--project $(PROJECT_ID) \
		--region=$(REGION) \
		--substitutions="\
_SERVICE_NAME=$(SERVICE_NAME),\
_REVISION_SUFFIX=$(GIT_COMMIT_SHA)-$(shell date +%Y%m%d%H%M%S)"