# olleenqvist.se

## Technical Requirements

- PHP 7.1
- Node.js 6

## Development

- Set up a PHP web server. Use the included file `vagrant-provision.sh` for fast provisioning if you want.
- Grab the ~~`/config/`~~ and `/content/` folders from staging/live server environments to get up and running.

## Deployment

- Run `npm run build` to generate static bundles
- ~~Run `npm run deploy` to publish static assets to S3/Cloudfront (there's a bug here sometimes, I usually have to run it twice)~~
  - ~~Also note that this dependency will likely stop working in 2023, so a new implementation is needed here. Perhaps just get rid of the CDN altogether?~~
- Commit the `rev-manifest.json` file to the main repo
- Manually transfer the `rev-manifest.json` file and the newly created `dist` folder file to the VPS, into this directory: `/usr/share/nginx/live/assets`

## Troubleshooting

- Restart the web server by SSH-ing into the VPS. Move to `/usr/share/nginx/live` and run `forever restart node_modules/gulp/bin/gulp.js production`
- Flush the cache by issuing this command: `echo 'flush_all' | nc localhost 11211`
