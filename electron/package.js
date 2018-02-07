const packager = require('electron-packager'),
    path = require('path'),
    fse = require('fs-extra');

const workDir = process.cwd();

const ignore = [
    'db/migrations',
    'e2e',
    'electron/package.js',
    'src',
    '.angular-cli.json',
    '.editorconfig',
    '.gitignore',
    '.sequelizerc',
    'karma.conf.js',
    'package-lock.json',
    'protractor.conf.js',
    'README.md',
    'tsconfig.json',
    'tslint.json'
];

const options = {
    dir: workDir,
    out: path.join(workDir, 'build'),
    overwrite: true
};

const removeUselessFiles = appPath => {
    return Promise.all(
        ignore.map(item => {
            return fse.remove( path.join(appPath, 'resources/app', item) );
        })
    );
};

const clearDB = appPath => {
    const db = require( path.join(appPath, 'resources/app/db/models') );
    return db.words.destroy({ truncate: true, logging: false });
};

packager(options, async (err, appPaths) => {
    if (err) {
        console.log(err);
    } else {
        for (let i = 0; i < appPaths.length; ++i) {
            await removeUselessFiles(appPaths[i]);
            await clearDB(appPaths[i]);
        }
        console.log('Packaging completed');
        console.log(appPaths);
    }
});