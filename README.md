# pi-media-server

Minimalistic media server intended to use with raspberry pi and [mpv](https://mpv.io/)
The server will generate a playlist file with the content of the directory specified in the configuration file. 

## Install and configuration

```bash
git clone https://github.com/andres7293/pi-media-server
cd pi-media-server
# install dependencies
npm install
# build project
npm run build
```

Create a file named: media-server.json with the following content:

````json
{
  "port": "8080",
  "media_dir": "<Path to your own media files>"
}
````

and then start the server !!!

```bash
npm run start
```

## Client side

If you want to consume your media you can use mpv.

```
curl -L http:<ip address>:<port>/playlist | mpv --playlist=-
# Search specific file
curl -L http:<ip address>:<port>/playlist | grep -i '<search term>' | mpv --playlist=-
```
