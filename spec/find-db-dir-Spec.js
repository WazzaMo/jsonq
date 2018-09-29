// By Warwick Molloy

const path = require('path');

const { findDbDir } = require('../src/find-db-dir');


let parent_dir = path.dirname(__dirname);
let parent_parent_dir = path.dirname(parent_dir);


describe('findDbDir', () => {
  describe('finds "db" in parent or parent-of-parent;', () => {

    describe('when db in parent dir,', () => {
      let pfs = {
        exists: (_path) => {
          return new Promise((resolve, reject) => resolve(_path === parent_dir + '/db'))
        }
      };
      let result;

      beforeEach(done => {
        findDbDir(pfs).catch(x => done.fail(x)).then(i => { result = i; done() });
      });

      it('must find db', () => {
        expect(result).toBe(path.join(parent_dir, 'db'));
      })
    })

    describe('when parent without db,', () => {
      describe('and parent-of-parent has db,', () => {
        let pfs = {
          exists: (_path) => {
            return new Promise((resolve, reject) => resolve(_path === parent_parent_dir + '/db'))
          }
        }

        let result;

        beforeEach(done => {
          findDbDir(pfs).then(i => { result = i; done(); });
        })

        it('must find db', () => {
          expect(result).toBe(path.join(parent_parent_dir, 'db'));
        })
      })

      describe('and parent-of-parent does NOT have db either,', () => {
        let pfs = {
          exists: (_path) => {
            return Promise.reject(`db was not found at ${_path}`);
          }
        };

        let result;

        beforeEach(done => {
          findDbDir(pfs).then(i => done.fail())
            .catch(err => { result = err; done(); });
        })

        it('must fail via catch', () => {
          expect(result).toBe('db was not found at ' + parent_parent_dir + '/db');
        })
      })
      
    })
  })
})

