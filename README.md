# my-words

Desktop application that helps to collect and repeat words

## Install
```bash
npm install                     # install node modules
npm run sequelize db:migrate    # run database migrations
```

## Development
```bash
ng build -w                     # build angular app and save in dist folder
npm run electron-app            # start electron app
```
> It's possible to open app in browser, but functionality related with database and node modules will not work

## Production
_in progress_

## Issues

#### Error `Cannot find module '...node_sqlite3.node'` on Windows
This error occures when trining to `require('sqlite3')` module. To fix this, follow next steps:
1. Open **cmd** as administrator and run `npm install --global --production windows-build-tools`.
2. Install python 2.7 and make sure that it accessible in cmd.
3. Open **cmd** in project folder and run `npm run electron-rebuild`.
