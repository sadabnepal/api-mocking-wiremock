# api-mocking-wiremock

A WireMock-based API mocking setup for Node.js using file-based stub mappings and dynamic response templating. Mocks the [JSONPlaceholder](https://jsonplaceholder.typicode.com/users) `/users` API with realistic dynamic data — no real network calls needed.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Java](https://www.java.com/en/download/) 11+ (required by WireMock under the hood)

Verify both are installed:

```bash
node -v
java -version
```

---

## Getting started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/api-mocking-wiremock.git
cd api-mocking-wiremock
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start WireMock

```bash
npm run mock:start
```

WireMock starts on `http://localhost:8080` and auto-loads all stubs from `mocks/mappings/` and response bodies from `mocks/__files/`.

### 4. Run the tests

Open a second terminal and run:

```bash
npm test
```

---

## Project structure

```
├── mocks
│   ├── __files
│   │   └── users.json
│   ├── helpers
│   │   └── setup-mocks.js
│   └── mappings
│       ├── get-all-users.json
│       ├── get-user-by-id.json
│       ├── get-user-not-found.json
│       ├── get-users-with-delay.json
│       └── post-create-user.json
├── package-lock.json
├── package.json
└── tests
    └── mocks.spec.js
```

---

## Available endpoints

| Method | URL | Description |
|--------|-----|-------------|
| `GET` | `/users` | Returns a list of dynamically generated users |
| `GET` | `/users/:id` | Returns a single user — ID is reflected in response |
| `GET` | `/users/999` | Returns a `404` not found response |
| `GET` | `/users?slow=true` | Returns users after a 3 second simulated delay |
| `POST` | `/users` | Creates a user — echoes `name` and `email` from request body |

---

## npm scripts

| Script | Command | Description |
|--------|---------|-------------|
| `mock:start` | `npx wiremock --port 8080 --root-dir ./mocks --global-response-templating` | Starts WireMock server |
| `test` | `mocha tests/**/*.spec.js --timeout 10000` | Runs the test suite |

---

## How it works

WireMock loads stub definitions from `mocks/mappings/*.json` on startup. Each mapping defines a request pattern to match and a response to return.

Dynamic responses use WireMock's built-in **Response Templating** (enabled via `--global-response-templating`). Handlebars helpers generate realistic data on every request without needing any external services.

```
Test → GET /users/42
            ↓
      WireMock :8080  matches urlPathPattern /users/([0-9]+)
            ↓
      __files/user.json  rendered with {{urlPathSegments.[1]}} = 42
            ↓
      { "id": 42, "name": "...", "email": "..." }
```

### Template helpers used

| Helper | Example | Result |
|--------|---------|--------|
| `urlPathSegments.[N]` | `{{urlPathSegments.[1]}}` | `42` from `/users/42` |
| `randomValue` | `type='ALPHABETICAL'` | Random letters |
| `randomValue` | `type='ALPHANUMERIC'` | Random letters and numbers |
| `randomValue` | `type='NUMERIC'` | Random digits |
| `jsonPath` | `{{jsonPath request.body '$.name'}}` | Echoes a POST body field |
| `now` | `{{now format='yyyy-MM-dd'}}` | Current date |

---

## Manually verify stubs

Once WireMock is running you can test endpoints directly:

```bash
# Get all users
curl http://localhost:8080/users

# Get user by ID
curl http://localhost:8080/users/1

# Get 404 response
curl http://localhost:8080/users/999

# Slow response (3s delay)
curl http://localhost:8080/users?slow=true

# Create a user
curl -X POST http://localhost:8080/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Doe", "email": "jane@example.com"}'

# List all loaded stubs
curl http://localhost:8080/__admin/mappings
```

---

## Dependencies

| Package | Purpose |
|---------|---------|
| `wiremock` | Runs WireMock standalone server via npx |
| `axios` | HTTP client used in tests |
| `mocha` | Test runner |
| `chai` | Assertion library |