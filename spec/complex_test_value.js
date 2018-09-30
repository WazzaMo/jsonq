let FILENAME = 'array-then-nested-objects.json';

let CONTENT = [
  {
    id: 35,
    fruit: { bananas: 'yellow', orange: 'orange' },
    providers: ['Coles', 'Woolworths'],
    meta: 'stuff to eat'
  },
  {
    id: 36,
    vehicles: { cars: 'small', trucks: 'big' },
    providers: ['Toyota', 'Ford'],
    meta: 'move from A to B'
  },
  { fruit: 'SKU1024'},
  { vehicles: 'SKU256' },
  {
    id: 0,
    description: ""
  },
];


let INDEX = {
  fruit: {
    branches: [
      { path: '[0]', children:['bananas', 'orange'], file: FILENAME }
    ],
    values: [
      { value: 'SKU1024', path: '[2]', file: FILENAME }
    ]
  },
  vehicles: {
    branches: [
      { path: '[1]', children: ['cars', 'trucks'], file: FILENAME }
    ],
    values: [
      { value: 'SKU256', path: '[3]', file: FILENAME }
    ]
  },
  providers: {
    values: [
      { value: ['Coles', 'Woolworths'], path: '[0]', file: FILENAME },
      { value: ['Toyota', 'Ford'], path: '[1]', file: FILENAME }
    ]
  },
  bananas: {
    values:[
      { value: 'yellow', path: '[0].fruit', file: FILENAME }
    ]
  },
  orange: {
    values: [
      { value: 'orange', path: '[0].fruit', file: FILENAME }
    ]
  },
  meta: {
    values: [
      { value: 'stuff to eat', path: '[0]', file: FILENAME },
      { value: 'move from A to B', path: '[1]', file: FILENAME }
    ]
  },
  cars: {
    values: [
      { value: 'small', path: '[1].vehicles', file: FILENAME }
    ]
  },
  trucks: {
    values: [
      { value: 'big', path: '[1].vehicles', file: FILENAME }
    ]
  },
  id: {
    values: [
      { value: 35, path: '[0]', file: FILENAME },
      { value: 36, path: '[1]', file: FILENAME },
      { value: 0, path: '[4]', file: FILENAME }
    ]
  },
  description: {
    values: [
      { value: '', path: '[4]', file: FILENAME }
    ]
  }
};

module.exports = {
  FILENAME,
  CONTENT,
  INDEX
}
