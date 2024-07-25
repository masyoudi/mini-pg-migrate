# mini-pg-migrate

PostgreSQL database migration

# Usage

## Instalation

```bash
$ npm install -D mini-pg-migrate
```

## Commands

### generate

```bash
$ node node_modules/mini-pg-migrate/dist/index.cjs generate <MIGRATION FILE NAME> <TARGET DIRECTORY> <VERSION>
```

> VERSION is optional

### up

```bash
$ node node_modules/mini-pg-migrate/dist/index.cjs migrate:up <PATH TO CONFIG FILE> <MIGRATION DIR>
```

### down

```bash
$ node node_modules/mini-pg-migrate/dist/index.cjs migrate:down <PATH TO CONFIG FILE> <MIGRATION DIR>
```
