# My words

An app that collects words and saves in the local database (sqlite)

## Install
```bash
npm install                     # install node modules
npm run sequelize db:migrate    # run database migrations
```

## Start Electron app
```bash
ng build -w                     # build Angular app and save in dist folder
npm run electron-app            # start Electron app
```

## Issues

#### Error `Cannot find module '...node_sqlite3.node'` on Windows
This error occures when trining to `require('sqlite3')` module. To fix this, follow next steps:
1. Open **cmd** as administrator and run `npm install --global --production windows-build-tools`.
2. Install python 2.7 and make sure that it accessible in cmd.
3. Open **cmd** in project folder and run `npm run electron-rebuild`.