const path = require('path');
const _ = require('lodash');

function summarise(filename, key, _value, _path, summary) {
  let item = { value: _value, path: _path, file: filename };

  if(_.has(summary, key)) {
    let values = summary[key].values;
    values.push( item )
  } else {
    summary[key] = { values: [ item ]};
  }
}

function addKeyValueIndex(filename, key, value, _path, summary) {
  summarise(filename, key, value, _path, summary);
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
    console.log("other");
  }
  return summary;
}

function list_keys_and_path(filename, json) {
  let doc = JSON.parse(json);
  return traverse(filename, doc);
}

module.exports = {
  list_keys_and_path
}