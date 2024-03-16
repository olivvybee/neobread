# neobread

Neobread is a set of bread emojis based on Neofox and Neocat, which were created
by [Volpeon](https://volpeon.ink/emojis/).

![A grid of bread emojis making various expressions.](https://github.com/olivvybee/neobread/releases/latest/download/preview.png)

Neobreads are licensed under
[CC-BY-NC-SA](https://creativecommons.org/licenses/by-nc-sa/4.0/), and the code
in this repository is licensed under the
[MIT license](https://opensource.org/license/mit).

## Adding to a fedi instance

A `.zip` file containing 256x256px PNGs of each emoji is available on the
[releases page](https://github.com/olivvybee/neobread/releases/latest). The
simplest (but most tedious) way to add the emojis to an instance is to download
that archive, extract it, and upload the emojis you want.

### Mastodon and glitch-soc

**Note: this method requires command line access to the instance. If you don't
have that, unfortunately you will need to add each emoji manually.**

Using
[Mastodon's `tootctl` CLI](https://docs.joinmastodon.org/admin/tootctl/#emoji-import)
lets you import the entire set at once from the command line.

If you trust random shell commands from the internet:

```
wget https://github.com/olivvybee/neobread/releases/latest/download/neobread.tar.gz
tootctl emoji import --category neobread ./neobread.tar.gz
```

Otherwise:

1. Download the
   [latest `neobread.tar.gz` archive](https://github.com/olivvybee/neobread/releases/latest).
2. Run `tootctl import` on the archive you downloaded.

### Misskey and its many forks (firefish, iceshrimp, sharkey, etc)

The PNG archive includes a `meta.json` that these instances can use to import
the entire archive at once.

1. Download the
   [latest `neobread.zip` archive](https://github.com/olivvybee/neobread/releases/latest).
2. In the custom emoji area of your instance, import the `.zip`.

The emojis will be categorised into `neobread`, `neofox`, and `neocat`
categories automatically.
