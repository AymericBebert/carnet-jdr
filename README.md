# Carnet JdR

Ayez toutes les infos pour vos persos de JdR à portée de main !

## Installation

```shell
npm install
```

## Development server

Run `npm run start` for a dev server. Navigate to `http://localhost:4700/`. The app will automatically reload if you change any of the source files.

## Build and publish a new version

We use GitHub Actions to build the new version on release.

In order to build a new version, you need to create a new release on GitHub, using semver tags.
The image is pushed to Docker Hub, then the Portainer stack is redeployed with its `VERSION` env variable set to the new tag.

Required GitHub Actions configuration:

- Secrets: `DOCKER_HUB_USERNAME`, `DOCKER_HUB_ACCESS_TOKEN`, `PORTAINER_API_KEY`
- Variables: `PORTAINER_URL`, `PORTAINER_STACK_ID`, `PORTAINER_ENDPOINT_ID`

## Running unit tests

```bash
npm run test
```

## Run as static website

```bash
npm run build:serve
```
