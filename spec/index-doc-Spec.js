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
        expect( list_keys_and_path(filename, JSON.stringify(content)) ).toHaveSameItems(expected_index)
      );

    }) //-- top level is object

    describe('where top level is array and keys link to values AND objects,', ()=>{
      let filename = 'array-then-nested-objects.json';

      let content = [
        {
          fruit: { bananas: 'yellow', orange: 'orange' },
          meta: 'stuff to eat'
        },
        {
          vehicles: { cars: 'small', trucks: 'big' },
          meta: 'move from A to B'
        },
        { fruit: 'SKU1024'},
        { vehicles: 'SKU256' }
      ];

      let expected_index = {
        fruit: {
          branches: [
            { path: '[0]', children:['bananas', 'orange'], file: filename }
          ],
          values: [
            { value: 'SKU1024', path: '[2]', file: filename }
          ]
        },
        vehicles: {
          branches: [
            { path: '[1]', children: ['cars', 'trucks'], file: filename }
          ],
          values: [
            { value: 'SKU256', path: '[3]', file: filename }
          ]
        },
        bananas: {
          values:[
            { value: 'yellow', path: '[0].fruit', file: filename }
          ]
        },
        orange: {
          values: [
            { value: 'orange', path: '[0].fruit', file: filename }
          ]
        },
        meta: {
          values: [
            { value: 'stuff to eat', path: '[0]', file: filename },
            { value: 'move from A to B', path: '[1]', file: filename }
          ]
        },
        cars: {
          values: [
            { value: 'small', path: '[1].vehicles', file: filename }
          ]
        },
        trucks: {
          values: [
            { value: 'big', path: '[1].vehicles', file: filename }
          ]
        }
      };

      it('must index branches and values', ()=>
        expect( list_keys_and_path(filename, JSON.stringify(content))).toHaveSameItems(expected_index)
      );
    })

  })

})