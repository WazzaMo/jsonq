# A JSON Query Tool

Assuming you keep a bunch of JSON files in a directory called `db`
and you wanted to find the object that had one of the following
situations and you wanted to find any matches.

- specific key *key* : *value* association
- Key *key* with an array that contains the value *value*
- Any object that has the value of *value*

This query tool will answer these questions in general:
- the JSON file that contains the result
- the array index (assuming it's an array of objects)
- if a value in an array, it will list the full array

Optionally, it can also dump the object with all the peer
keys.

## Usage

This is a CLI tool. Run using the `jsonq` shell script...

jsonq [options] \<key\>=\<value\>

Where:
options are:

|Option | Meaning |
|-------|---------|
| -h or --help | for help info |
| -o or --object | to dump related object |

*key* should be a valid key or `?` to search by value only.

*value* can be a number, a floating point, a boolean value
or a string. It can also be a full value or a value that is part of an array.

### Example

```sh
jsonq -o _id=10
```
Will dump the key-value information and objects found
for those keys.