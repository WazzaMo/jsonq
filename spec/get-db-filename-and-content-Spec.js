
require('jasmine-collection-matchers')

const path = require('path');

const { getDbFileNamesAndContent } = require('../src/get-db-filenames-and-content');


describe('getDbFileNamesAndContent', () => {
  describe('when multiple files are read,', () => {
    let testFiles = {
      'foo.json': { greet: 'hi' },
      'fi.json': { test: 'is ok' }
    };

    function getMockNames() {
      let list = [];
      for (var i in testFiles) {
        list.push(i);
      }
      return list;
    }

    let pfs = {
      readdir: (_path) => {
        return Promise.resolve(getMockNames());
      },
      readFile: (_fname, option) => {
        if (option != 'utf8') Promise.reject("bad option");
        return Promise.resolve(JSON.stringify(testFiles[path.basename(_fname)]));
      }
    };

    let result;

    beforeEach(done =>
      getDbFileNamesAndContent(pfs, '../db')
        .then(name_and_content => {
          result = name_and_content;
          done();
        })
        .catch(err => done.fail())
    );

    it('must get a list of 2 items', () => {
      expect(result.length).toBe(2);
    })

    it('must have the correct file names', () => {
      const ExpectedFiles = getMockNames();

      expect(result.map(obj => obj.name)).toHaveSameItems(ExpectedFiles);
    })

    it('must match content for each file', () => {
      result.forEach(item =>
        expect(item.content)
          .toEqual(JSON.stringify(testFiles[item.name]))
      );
    })
  })
})
