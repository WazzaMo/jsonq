const path = require('path');
const _ = require('lodash');

const
  BRANCH_ENTRY = 'branches',
  VALUE_ENTRY = 'values';


function ensureKeyIndexEntry(key, _summary) {
  if (! _.has(_summary, key)) {
    entry = _summary[key] = {};
  }
  return _summary[key];
}

function addKeyBranchIndex(filename, key, _object, _path, summary) {
  let branch = { path: _path, children: _.keys(_object), file: filename };

  let entry = ensureKeyIndexEntry(key, summary);
  if (_.has(entry, BRANCH_ENTRY)) {
    entry[BRANCH_ENTRY].push( branch );
  } else {
    entry[BRANCH_ENTRY] = [ branch ];
  }
}

function addKeyValueIndex(filename, key, _value, _path, summary) {
  let item = { value: _value, path: _path, file: filename };

  let entry = ensureKeyIndexEntry(key, summary);
  if(_.has(entry, VALUE_ENTRY)) {
    entry[VALUE_ENTRY].push( item )
  } else {
    entry[VALUE_ENTRY] = [ item ];
  }
}

function isIndexable(value) {
  return _.isArray(value)
  || _.isString(value)
  || _.isNumber(value)
  || _.isDate(value)
  || _.isBoolean(value);
}

function appendPathWithIndex(_path, index) {
  let _inpath = `${_path}[${index}]`
  return _inpath;
}

function appendPathWithKey(_path, key) {
  let inpath;
  if (_path === '') {
    inpath = key;
  } else {
    inpath = `${_path}.${key}`
  }
  return inpath;
}

function traverseAny(filename, _any, _path, summary) {
  if (_.isArray(_any)) {
    traverseArray(filename, _any, _path, summary);
  } else if (_.isObject(_any)) {
    traverseObject(filename, _any, _path, summary);
  } else if (_.isString(_any)) {}
}


function traverseObject(filename, _object, _path, _summary) {
  _.forIn(_object, (value, key)=> {
    if (isIndexable( value )) {
      addKeyValueIndex(filename, key, value, _path, _summary);
    } else if (_.isObject(value)) {
      addKeyBranchIndex(filename, key, value, _path, _summary);
      traverseObject( filename, value, appendPathWithKey(_path, key), _summary);
    }
  });
}


function traverseArray(filename, _array, _path, summary) {
  for(var index in _array) {
    let _inpath = appendPathWithIndex(_path, index);
    let value = _array[index];
    traverseAny(filename, value, _inpath, summary);
  }
}

function traverse(filename, obj ) {
  let summary = {};
  if (_.isArray(obj)) {
    traverseArray(filename, obj, '', summary);
  } else if ( _.isObject(obj) ) {
    traverseObject(filename, obj, '', summary);
  } else {
    throw `Expected object or array at the top-level of JSON! Not ${JSON.stringify(obj)}`;
  }
  return summary;
}

function list_keys_and_path(filename, json) {
  let doc = JSON.parse(json);
  return traverse(filename, doc);
}

module.exports = {
  list_keys_and_path,
  BRANCH_ENTRY,
  VALUE_ENTRY
}