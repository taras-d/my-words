const packager = require('electron-packager'),
    path = require('path');

const workDir = process.cwd();

const options = {
    dir: workDir,
    out: path.join(workDir, 'build'),
    overwrite: true,
    // TODO: fix igonre list
    // ignore: [
    //     '/db/migrations',
    //     '/e2e',
    //     '/electron/package.js',
    //     '/src',
    //     '/\\.angular-cli\\.json',
    //     '/\\.editorconfig',
    //     '/\\.gitignore',
    //     '/\\.sequelizerc',
    //     '/karma\\.conf\\.js',
    //     '/protractor\\.conf\\.js',
    //     '/README\\.md',
    //     '/tsconfig\\.json',
    //     '/tslint\\.json'
    // ]
};

const clearDB = async appPaths => {
    for (let i = 0; i < appPaths.length; ++i) {
        const db = require( path.join(appPaths[i], 'resources/app/db/models') );
        await db.words.destroy({ truncate: true, logging: false });
    }
};

packager(options, async (err, appPaths) => {
    if (err) {
        console.log(err);
    } else {
        await clearDB(appPaths);
        console.log('Packaging completed');
    }
});