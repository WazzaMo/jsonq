require('jasmine-collection-matchers')

const { list_keys_and_path } = require('../src/index-doc');

describe('index-doc', ()=>{

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

      beforeEach( ()=> result = list_keys_and_path( filename, JSON.stringify(array_of_obj)) );

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
        expect( list_keys_and_path(filename, JSON.stringify( array_objects_with_arrays )) ).toHaveSameItems( expected_index )
      )

    }) //-- doc is array of objects with array values

  })

})