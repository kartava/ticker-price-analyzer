# Ticker Price Monitor

## Prerequisites

To begin you should have the following applications installed on your local
development system:

- [NodeJS](https://nodejs.org/en/download/) >= 18
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)

## Getting Started

First clone the repository from GitHub and switch to the project directory:

```bash
$ git clone https://github.com/kartava/ticker-price-monitor
$ cd ticker-price-monitor
```

Install project dependencies:

```bash
$ yarn install
```

Copy the example environment file and configure it:

```bash
$ cp .env.example .env
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
