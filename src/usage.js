// JSON Query Tool
// (c) Copyright 2018 Warwick Molloy

const process = require('process');
const _ = require('lodash');

const HEADING = 'jsonq [options] <key>=<value>';

function skipNodeAndScriptNameFromArgs() {
  let params = process.argv.slice(2);

  if (params.length == 0) {
    console.log(
      `${HEADING}
      No options or query given.
      To get help, try: jsonq -h`
    );
    process.exit(0);
  }

  return params;
}

function usage() {
  console.log(`
  JSONQ - JSON Query Tool - (c) Copyright 2018 Warwick Molloy
  
  ${HEADING}

  Where options are:
  -o, --object  Include related objects
  -h, --help    This usage info.

  For value-only search, use ? as the key
  `);
  process.exit(0);
}

function isFloatString(value) {
  return _.isString(value)
  && value.match(/\d*\.\d+/) != null;
}

function isIntString(value) {
  return _.isString(value)
  && value.match(/\d+/);
}

function getNaturalValue(value) {
  if (isFloatString(value)) {
    return Number.parseFloat(value);
  } else if (isIntString(value)) {
    return Number.parseInt(value);
  } else if (value === 'true') {
    return true;
  } else if (value === 'false') {
    return false;
  } else {
    return value;
  }
}

function getKeyValue(keyValueSpec) {
  let result = keyValueSpec.match(/(.*)=(.*)/);
  if (result) {
    let [_line, _key, _value] = result;
    key = _key;
    value = _value;
    return { key: _key, value: getNaturalValue( _value ) };
  } else {
    console.log(`jsonq
    query needs to be: <key>=<value>
    Examples:

    To find all fields with the value of "Fred"
     % jsonq ?="Fred"
    
    To find all 'id' fields with value 5
     % jsonq id=5
    `);
    process.exit(-1);
  }
}

function getOpts() {
  let _objectDump = false;
  let optIncludeObject = () => _objectDump = true;
  let optGetHelpAndQuit = () => usage();

  let options = [
    { opt: '-o', action: optIncludeObject }, { opt: '--object', action: optIncludeObject },
    { opt: '-h', action: optGetHelpAndQuit }, { opt: '--help', action: optGetHelpAndQuit }
  ];

  let params = skipNodeAndScriptNameFromArgs();
  
  _.forEach( params, value => {
    let opt = _.find( options, optItem => optItem.opt === value );
    if (opt) {
      opt.action();
    }
  })
  let vals = getKeyValue(_.last(params));
  vals.objectDump = _objectDump;
  return vals;
}

module.exports = {
  HEADING,
  getOpts
}