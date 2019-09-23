/*
returns a type validation
other validation types can be found here:
https://github.com/typestack/class-validator
*/

const typeVals = {
  boolean: 'IsBoolean', // Checks if a given value is a real boolean.
  Date: 'IsDate', // Checks if a given value is a real date.
  string: 'IsString', // Checks if a given value is a real string.
  number: 'IsNumber', // Checks if a given value is a real number.
  any: 'IsOptional', // doesn't have to be there
}

module.exports = function(jsType) {
  return typeVals[jsType];
}
