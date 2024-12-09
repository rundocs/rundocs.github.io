define logger
	@echo "\033[32m🔥 make $@...\033[0m"
endef

.PHONY: defaults
defaults: install test build

.PHONY: install
install:
	@$(logger)
	@npm $@ -g pnpm
	@pnpm $@

.PHONY: test
test:
	@$(logger)
	@pnpm vitest --run

.PHONY: lint
lint:
	@$(logger)
	@pnpm eslint src --fix

.PHONY: build
build: lint
	@$(logger)
	@pnpm vite $@
	@pnpm licenses list --prod > dist/licenses.txt

.PHONY: dev
dev:
	@$(logger)
	@pnpm vite

.PHONY: preview
preview: build
	@$(logger)
	@pnpm vite $@
