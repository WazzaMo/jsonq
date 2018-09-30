// JSON Query Tool
// (c) Copyright 2018 Warwick Molloy

const _ = require('lodash');
const fs = require('fs-extra');
const jsome = require('jsome');


const { getOpts } = require('./usage');
const { findDbDir } = require('./find-db-dir');
const { getDbFileNamesAndContent } = require('./get-db-filenames-and-content');
const { index_doc, merge_index } = require('./index-doc');

const {
  find_objects_by_key_value,
  find_objects_by_key_with_list_value,
  find_objects_containing_value
} = require('./search');



function print_results(query, results, json_data) {
  let count = 0;

  for(var outcome of results) {
    count++;

    console.log(`==== Row #${count} ====`);
    jsome(outcome);

    if (query.objectDump) {
      let part = _.at(json_data[outcome.file], [`${outcome.path}`]);
      console.log(`--{ Related Values - Row #${count} }--`);
      jsome(part[0]);
      console.log('= = = = = = = = = = = = = =');
    }
  }
  console.log(`
  =================================
     ${results.length} Results Found
  =================================
  `);
}

function is_value_only_query(query) {
  return query.key === '?';
}

function attempt_key_value_match_followed_by_key_array_member_match(full_index, query) {
  let results = find_objects_by_key_value(full_index, query.key, query.value);

  if (! results.length) {
    results = find_objects_by_key_with_list_value(full_index, query.key, query.value);
  }
  return results;
}

function runQuery(query, json_data, full_index) {
  let results;

  if (is_value_only_query(query)) {
    results = find_objects_containing_value(full_index, query.value);
  } else {
    results = attempt_key_value_match_followed_by_key_array_member_match(full_index, query);
  }
  print_results(query, results, json_data);
}

function indexDbAndRunQuery(query) {
  findDbDir(fs)
  .then( _path => getDbFileNamesAndContent(fs, _path))
  .then( list_of_name_content => {
    let full_index = {};
    let json_data = {};

    for(var {name, content} of list_of_name_content) {
      json_data[name] = JSON.parse( content );
      let file_index = index_doc(name, content);
      full_index = merge_index(full_index, file_index);
    }
    runQuery(query, json_data, full_index);
  })
  .catch( err => console.error(err));
}

function main() {
  let query = getOpts();
  indexDbAndRunQuery(query);
}

main();