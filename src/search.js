const _ = require('lodash');

const {
  BRANCH_ENTRY,
  VALUE_ENTRY
} = require('./index-doc');

function get_reference(value_entry) {
  let ref = {};
  ref.path = value_entry.path;
  ref.file = value_entry.file;
  return ref;
}

function find_object_by_key_value(_index, key, value) {
  if (_.has(_index, key) ) {
    let values = _index[key][VALUE_ENTRY];
    let selected = values.filter( item => item.value === value);
    let obj = get_reference( _.first(selected) );
    return obj;
  }
}

module.exports = {
  find_object_by_key_value
}