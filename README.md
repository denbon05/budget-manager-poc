# budget-manager

P2P budget manager.

## Prerequisites

|      pkg       | version |
| :------------: | :-----: |
|    Node.js     |  ^18.x  |
| docker compose |  ^2.x   |
| Android Studio |  ^21.x  |

## Project Setup

```sh
make setup # setup environment
```

```sh
bun install
```

### Compile and Hot-Reload for Development

```sh
bun dev
```

### Type-Check, Compile and Minify for Production

```sh
bun build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
bun test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
bun build

# Runs the end-to-end tests
bun test:e2e
# Runs the tests only on Chromium
bun test:e2e --project=chromium
# Runs the tests of a specific file
bun test:e2e tests/example.spec.ts
# Runs the tests in debug mode
bun test:e2e --debug
```

### Project utils

```sh
bun lint # fix with eslint
bun format # format with prettier
```
