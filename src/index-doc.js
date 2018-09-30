// JSON Query Tool
// (c) Copyright 2018 Warwick Molloy

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

function index_doc(filename, json) {
  let doc = JSON.parse(json);
  return traverse(filename, doc);
}

function getValues(_index, key) {
  if (_.has(_index, key) && _.has(_index[key], VALUE_ENTRY)) {
    return _index[key][VALUE_ENTRY];
  }
  return [];
}

function getBranches(_index, key) {
  if(_.has(_index, key) && _.has(_index[key], BRANCH_ENTRY)) {
    return _index[key][BRANCH_ENTRY];
  }
  return [];
}

function merge_index(_index1, _index2) {
  let merged = {};
  
  let all_keys = _.concat( _.keys(_index1),_.keys(_index2 ) );

  for(var key of all_keys) {
    let values1 = getValues(_index1, key);
    let branches1 = getBranches(_index1, key);
    let values2 = getValues(_index2, key);
    let branches2 = getBranches(_index2, key);

    let merged_values = _.concat(values1, values2);
    let merged_branches = _.concat(branches1, branches2);
    merged[key] = {};
    if (merged_values.length > 0) {
      merged[key][VALUE_ENTRY] = merged_values;
    }
    if (merged_branches.length > 0) {
      merged[key][BRANCH_ENTRY] = merged_branches;
    }
  }
  return merged;
}


module.exports = {
  index_doc,
  merge_index,
  BRANCH_ENTRY,
  VALUE_ENTRY
}