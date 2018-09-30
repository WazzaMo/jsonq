// JSON Query Tool
// (c) Copyright 2018 Warwick Molloy

const path = require('path');

const DBPATH = 'db';


function dbAt( _path ) {
    return path.join( _path, DBPATH);
}

function promiseToReturnPathIfAt(pfs, place) {
    let pathAtPlace = dbAt( place );
    return new Promise( (resolve,reject) => 
        pfs.exists( pathAtPlace )
        .then(isOk => {
            if (isOk) {
                resolve( pathAtPlace );
            } else {
                reject(`Not found in ${pathAtPlace}`);
            }
        })
        .catch(err => reject(err))
    );
}

function findDbDir(pfs) {
    let parent = path.dirname( __dirname );
    let parent_of_parent = path.dirname( parent );

    return promiseToReturnPathIfAt(pfs, parent)
    .then(dbPlace => dbPlace)
    .catch( err => promiseToReturnPathIfAt(pfs, parent_of_parent));
}

module.exports = {
    findDbDir,
    DBPATH
}