require('jasmine-collection-matchers')

const { index_doc, merge_index } = require('../src/index-doc');

describe('index-doc:', ()=>{

  describe('index_doc(filename,json)', ()=> {

    describe('list_keys_and_path', () => {

      describe('where doc is array of simple objects,', ()=> {

        let filename = 'simple-objects.json';

        let array_of_obj = [
          { name: "test1", value: 100 },
          { name: "test2", value: 200 }
        ];

        let flattened_keys = {
          name: {
            values: [
              { value: "test1", path: '[0]', file: filename },
              { value: "test2", path: '[1]', file: filename }
            ]
          },
          value: {
            values: [
              { value: 100, path: '[0]', file: filename },
              { value: 200, path: '[1]', file: filename }
            ]
          }
        };

        let result;

        beforeEach( ()=> result = index_doc( filename, JSON.stringify(array_of_obj)) );

        it('must return a set of keys with path', () => {
          expect(result).toHaveSameItems(flattened_keys);
        })

      })

      describe('where doc is array of objects with array values,', ()=> {

        let filename = 'array-values.json';

        let array_objects_with_arrays = [
          {
            id: 'DEADBEEF',
            houses: [
              'pink-house',
              'blue-house',
              'red-house'
            ]
          },
          {
            id: 'FEEDF00D',
            houses: [
              'griffindorf',
              'snape'
            ]
          }
        ];

        let expected_index = {
          id: { values: [
            { value: 'DEADBEEF', path: '[0]', file: filename},
            { value: 'FEEDF00D', path: '[1]', file: filename}
          ]},
          houses: { values: [
            { value: ['pink-house','blue-house','red-house'], path: '[0]', file: filename },
            { value: ['griffindorf','snape'], path: '[1]', file: filename }
          ]}
        }

        it('must provide the array as the value', ()=>
          expect( index_doc(filename, JSON.stringify( array_objects_with_arrays )) ).toHaveSameItems( expected_index )
        )

      }) //-- doc is array of objects with array values

      describe('where top level is an object,', ()=> {
        let filename='object-at-top.json';

        let content= {
          first: { id: 'DEADBEEF', name: 'Fred' },
          second: { id: 'DEADCAO', name: 'Nhat' }
        };

        let expected_index = {
          first: { branches: [
            { path: '', children: ['id', 'name'], file: filename }
          ]},
          second: { branches: [
            { path: '', children: ['id', 'name'], file: filename }
          ]},
          id: { values: [
            { value: 'DEADBEEF', path: 'first', file: filename },
            { value: 'DEADCAO', path: 'second', file: filename }
          ]},
          name: { values: [
            { value: 'Fred', path: 'first', file: filename },
            { value: 'Nhat', path: 'second', file: filename }
          ]}
        };

        it('must find the leaf keys,', ()=> 
          expect( index_doc(filename, JSON.stringify(content)) ).toHaveSameItems(expected_index)
        );

      }) //-- top level is object

      describe('where top level is array and keys link to values AND objects,', ()=>{
        let { CONTENT, INDEX, FILENAME } = require('./complex_test_value');

        it('must index branches and values', ()=>
          expect( index_doc(FILENAME, JSON.stringify(CONTENT))).toHaveSameItems(INDEX)
        );
      })

    })

  }) //-- index_doc

  describe('merge_index(_index1, _index2)', () => {

    describe('where one index is empty,', ()=>{
      let filename='object-at-top.json';

      let empty = {};

      let other = {
        first: { branches: [
          { path: '', children: ['id', 'name'], file: filename }
        ]},
        second: { branches: [
          { path: '', children: ['id', 'name'], file: filename }
        ]},
        id: { values: [
          { value: 'DEADBEEF', path: 'first', file: filename },
          { value: 'DEADCAO', path: 'second', file: filename }
        ]},
        name: { values: [
          { value: 'Fred', path: 'first', file: filename },
          { value: 'Nhat', path: 'second', file: filename }
        ]}
      };

      it('merge_index(empty, other) returns other', ()=>
        expect( merge_index(empty, other)).toHaveSameItems( other )
      );

      it('merge_index( other, empty) returns other', ()=>
        expect( merge_index(other, empty)).toHaveSameItems( other )
      );

    }) // where one index empty

    describe('when two different indices,', ()=> {
      let filename1 = 'file1.json';

      let index1 = {
        first: { branches: [
          { path: '', children: ['id', 'name'], file: filename1 }
        ]},
        second: { branches: [
          { path: '', children: ['id', 'name'], file: filename1 }
        ]},
        id: { values: [
          { value: 'DEADBEEF', path: 'first', file: filename1 },
          { value: 'DEADCAO', path: 'second', file: filename1 }
        ]},
        name: { values: [
          { value: 'Fred', path: 'first', file: filename1 },
          { value: 'Nhat', path: 'second', file: filename1 }
        ]}
      };

      let filename2 = 'FILE2.json';

      let index2 = {
        id: { values: [
          { value: 'DEADBEEF', path: '[0]', file: filename2},
          { value: 'FEEDF00D', path: '[1]', file: filename2}
        ]},
        houses: { values: [
          { value: ['pink-house','blue-house','red-house'], path: '[0]', file: filename2 },
          { value: ['griffindorf','snape'], path: '[1]', file: filename2 }
        ]}
      }

      let mix = {
        houses: { values: [
          { value: ['pink-house','blue-house','red-house'], path: '[0]', file: filename2 },
          { value: ['griffindorf','snape'], path: '[1]', file: filename2 }
        ]},
        first: { branches: [
          { path: '', children: ['id', 'name'], file: filename1 }
        ]},
        second: { branches: [
          { path: '', children: ['id', 'name'], file: filename1 }
        ]},
        id: { values: [
          { value: 'DEADBEEF', path: 'first', file: filename1 },
          { value: 'DEADCAO', path: 'second', file: filename1 },
          { value: 'DEADBEEF', path: '[0]', file: filename2},
          { value: 'FEEDF00D', path: '[1]', file: filename2}
        ]},
        name: { values: [
          { value: 'Fred', path: 'first', file: filename1 },
          { value: 'Nhat', path: 'second', file: filename1 }
        ]}
      }

      it('must merge 2, keeping all keys', () => 
        expect( merge_index( index1, index2 )).toHaveSameItems( mix )
      );

    }); // when 2 different index

  }) //-- merge_index

})