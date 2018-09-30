require('jasmine-collection-matchers')

const { find_object_by_key_value } = require('../src/search');

let filename = 'array-then-nested-objects.json';

let index = {
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


describe('search:', () => {

  describe('find_object_by_key_value(_index, key, value) ', () => {

    describe('when simple key: value entries in JSON,', ()=> {
      
      it('must find a simple key=value', ()=>
        expect(find_object_by_key_value(index, 'bananas', 'yellow')).toHaveSameItems(
          {path:'[0].fruit', file:filename}
        )
      );

    })

  })

})