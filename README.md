# Nightwing

It's a small local service that watch remote service project and made you report on multiple endpoint.

## Install

```bash
snap install nightwing
```

You need to configure the file store into `$HOME/snap/nightwing/configuration.yaml`.  
You can found the whole options into the [wiki](https://github.com/ZephirDev/nightwing/wiki).

The service is run automaticly everyday at midnight.  
You can also run this to manualy test it.

```bash
/snap/bin/nightwing.cli
```

## Supported services

### Github

- :ok: survey tags

## Supported reports

- :ok: SMTP
- :ok: Google Chat
