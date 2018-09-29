const path = require('path');

function getNameAndContent(pfs, name, _path) {
  return new Promise( (resolve, reject) => {
      let filePath = path.join(_path, name);

      pfs.readFile(filePath, 'utf8')
      .then(content => resolve({name, content}) )
      .catch(err => reject(`File read error: ${err}`) );
  });
}

function getDbFileNamesAndContent(pfs, dbPath) {
  return new Promise( (resolve, reject) => {
      pfs.readdir(dbPath)
      .then( list => {
          let promises = [];

          for(var name of list) {
              promises.push( getNameAndContent(pfs, name, dbPath));
          }
          Promise.all( promises )
              .then( files_and_content => resolve(files_and_content))
              .catch( err => reject(err));
      })
      .catch( err => reject(`I/O error: ${err}`));
  });
}

module.exports = {
  getDbFileNamesAndContent
}