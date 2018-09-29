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

function traverseAny(filename, _any, _path, summary) {
  if (_.isArray(_any)) {
    traverseArray(filename, _any, _path, summary);
  } else if (_.isObject(_any)) {
    traverseObject(filename, _any, _path, summary);
  } else if (_.isString(_any)) {}
}

function traverseObject(filename, _object, _path, summary) {
  _.forIn(_object, (value, key)=> {
    summarise(filename, key, value, _path, summary);
  })
}

function appendPathWithIndex(_path, index) {
  let _inpath = `${_path}[${index}]`
  return _inpath;
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
    traverseArray(filename, obj, [], summary);
  } else if ( _.isObject(obj) ) {
    console.error(`object not supported`)
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