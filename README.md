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

with scripts within `package.json`
```json
{
  "scripts": {
    "migration:generate": "mini-pg-migrate generate <MIGRATION FILE NAME> <TARGET DIRECTORY> <VERSION>"
  }
}
```

### up

```bash
$ node node_modules/mini-pg-migrate/dist/index.cjs migrate:up <PATH TO CONFIG FILE> <MIGRATION DIR>
```

with scripts within `package.json`
```json
{
  "scripts": {
    "migration:up": "mini-pg-migrate migrate:up <PATH TO CONFIG FILE> <MIGRATION DIR>"
  }
}

### down

```bash
$ node node_modules/mini-pg-migrate/dist/index.cjs migrate:down <PATH TO CONFIG FILE> <MIGRATION DIR>
```

with scripts within `package.json`
```json
{
  "scripts": {
    "migration:down": "mini-pg-migrate migrate:down <PATH TO CONFIG FILE> <MIGRATION DIR>"
  }
}