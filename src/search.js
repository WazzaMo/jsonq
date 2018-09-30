// JSON Query Tool
// (c) Copyright 2018 Warwick Molloy

const _ = require('lodash');

const {
  BRANCH_ENTRY,
  VALUE_ENTRY
} = require('./index-doc');

function get_reference(value_entries) {
  return value_entries.map( entry => {
      return {
      path: entry.path,
      file: entry.file
    }
  });
}

function get_key_value_entry(_index, key) {
  if (_.has(_index, key)) {
    return _index[key];
  } else {
    throw `Key "${key}" does not appear in any database file.`
  }
}

function find_objects_by_key_value(_index, key, value) {
  let key_entry = get_key_value_entry(_index, key);

  let values = key_entry[VALUE_ENTRY];
  let selected = values.filter( item => item.value === value);
  let obj = get_reference( selected );
  return obj;
}

function find_objects_by_key_with_list_value(_index, key, member) {
  let key_entry = get_key_value_entry(_index, key);

  let values = key_entry[VALUE_ENTRY];
  let selected = values.filter( item => 
    _.isArray(item.value) && item.value.includes(member)
  );
  return selected;
}

function get_all_keys_with_values(_index) {
  let keys = _.keys(_index);
  return keys.filter(a_key => _.has(_index[a_key], VALUE_ENTRY) );
}

function get_list_of_values(_index) {
  let value_keys = get_all_keys_with_values(_index);
  return value_keys.map( key => {
    return {
      key,
      values: _index[key][VALUE_ENTRY]
    }
  });
}

function is_match_by_value_or_value_in_array(value_entry, target) {
  if (value_entry.value === target) {
    return true;
  } else if ( _.isArray(value_entry.value) && value_entry.value.includes(target) ) {
    return true;
  }
  return false;
}

function get_list_matching_value(_index, value) {
  let all_values = get_list_of_values(_index);
  let flattened_values = [];
  for(var key_list_pair of all_values) {
    let matches = key_list_pair.values.filter( val_entry => is_match_by_value_or_value_in_array(val_entry, value) );
    for(var item of matches) {
      let result = {
        key: key_list_pair.key,
        path: item.path,
        file: item.file
      };
      if (_.isArray(item.value)) {
        result.array = item.value;
      }
      flattened_values.push(result);
    }
  }
  return flattened_values;
}

function find_objects_containing_value(_index, _value) {
  return get_list_matching_value(_index, _value);
}

module.exports = {
  find_objects_by_key_value,
  find_objects_by_key_with_list_value,
  find_objects_containing_value
}