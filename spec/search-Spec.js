require('jasmine-collection-matchers')

const { FILENAME, INDEX } = require('./complex_test_value');

const {
  find_objects_by_key_value,
  find_objects_by_key_with_list_value,
  find_objects_containing_value
} = require('../src/search');

describe('search:', () => {

  describe('find_object_by_key_value(_index, key, value) ', () => {

    describe('when called with key that cannot be found,', () => {
      
      it('must throw an error', ()=>
        expect(
          () => find_objects_by_key_value(INDEX, '-missing-','no-value')
        ).toThrow('Key "-missing-" does not appear in any database file.')
      );
    })

    describe('when simple key: value entries in JSON,', ()=> {

      it('must find simple bananas: "yellow"', ()=>
        expect(find_objects_by_key_value(INDEX, 'bananas', 'yellow')).toHaveSameItems(
          [{path:'[0].fruit', file:FILENAME}]
        )
      );

      it('must find simple vehicles: "SKU256"', ()=>
        expect(find_objects_by_key_value(INDEX, 'vehicles', 'SKU256')).toHaveSameItems(
          [{path: '[3]', file: FILENAME}]
        )
      );

      it('must find numeric value by key',() =>
        expect(find_objects_by_key_value(INDEX, 'id', 36)).toHaveSameItems(
          [{ path: '[1]', file: FILENAME }]
        )
      );

      it('must find empty text value', ()=> 
        expect(find_objects_by_key_value(INDEX, 'description', '')).toHaveSameItems(
          [ { path: '[4]', file: FILENAME } ]
        )
      );

    }) // when simple key value

    describe('when key:value finds nothing', ()=> {
      
      it('must return empty array', () => 
        expect(find_objects_by_key_value(INDEX,'id', -1)).toHaveSameItems( [] )
      );

    }) // when key:value finds nothing

  }) //-- find_object_by_key_value()

  describe('find_object_by_key_with_list_value()', ()=> {
    
    it('must throw exception when key not found', ()=> 
      expect(
        () => find_objects_by_key_with_list_value(INDEX, 'missing-key', 'noval')
      ).toThrow('Key "missing-key" does not appear in any database file.')
    );

    it('must identify an array by one value it contains and list the full array', ()=>
      expect(find_objects_by_key_with_list_value(INDEX, 'providers', 'Coles')).toHaveSameItems([
        {
          value: [ 'Coles', 'Woolworths'],
          path: '[0]',
          file: FILENAME
        }
      ])
    );

  }) //-- find_object_by_key_with_list_value()

  describe('find_objects_containing_value(_index, value)',()=>{

    describe('when value is a number,', ()=> {

      it('must find simple match', ()=>
        expect(find_objects_containing_value(INDEX, 35)).toHaveSameItems([
          { key: 'id', path: '[0]', file: FILENAME }
        ])
      );

      it('must find nested key with simple value', ()=>
        expect(find_objects_containing_value(INDEX, 'small')).toHaveSameItems([
          { key: 'cars', path: '[1].vehicles', file: FILENAME }
        ])
      );

      it('must find array values by one value in the array', () =>
        expect(find_objects_containing_value(INDEX, 'Toyota')).toHaveSameItems([
          { key: 'providers', array: ['Toyota', 'Ford'], path: '[1]', file: FILENAME }
        ])
      );

    })
  })

})