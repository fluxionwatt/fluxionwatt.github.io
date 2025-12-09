# Using rpm package

## Download

Download the installation package according to different versions and architectures, E.g.

```bash
$ wget https://www.emqx.com/en/downloads/gridbeat/2.5.3/gridbeat-2.5.3-linux-amd64.rpm
```

## Install

Install according to different versions and architectures, E.g.

```bash
$ sudo rpm -i gridbeat-2.5.3-linux-amd64.rpm
```

::: tip
After successful installation of the rpm package, GridBeat is automatically started.
:::

## Status

```bash
$ sudo systemctl status gridbeat
```

## Stop

```bash
$ sudo systemctl stop gridbeat
```

## Restart

```bash
$ sudo systemctl restart gridbeat
```

## Uninstall

```bash
$ sudo rpm -e gridbeat
```