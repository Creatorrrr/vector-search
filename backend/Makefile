.PHONY: test test-unit test-integration test-e2e test-coverage test-watch clean install

# Test commands
test:
	pytest

test-unit:
	pytest tests/unit -m unit

test-integration:
	pytest tests/integration -m integration

test-e2e:
	pytest tests/e2e -m e2e

test-coverage:
	pytest --cov=app --cov-report=html --cov-report=term

test-watch:
	pytest-watch

# Install dependencies
install:
	pip install -r requirements.txt

# Clean commands
clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name "htmlcov" -exec rm -rf {} +
	find . -type d -name ".coverage" -exec rm -rf {} +

# Format code
format:
	black app tests
	isort app tests

# Lint code
lint:
	flake8 app tests
	mypy app

# Run all checks
check: format lint test
