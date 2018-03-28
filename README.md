# brightnessctl

Small tool for linux to adjust screen brightness.

```
npm install -g brightnessctl
```

Tested on the Dell XPS13 running Arch.

## Usage

To adjust the screen brightness simply run

```
sudo brightnessctl
```

It will print an interactive slider that looks like this:

```
Use <left> and <right> to adjust brightness
[#######                                        ]  15%
```

You can also adjust the brightness with a cli argument like so

```
sudo brightnessctl 50 # sets the brightness to 50%
```

PRs that add support for more distros welcome.

## License

MIT
