/* rough guess at type translation */
var jstypes = {
  varchar: 'string',
  nvarchar: 'string',
  text: 'string',
  int: 'number',
  bigint: 'number',
  tinyint: 'boolean',
  smallint: 'number',
  bit: 'boolean',
  float: 'number',
  numeric: 'number',
  decimal: 'number',
  real: 'number',
  date: 'Date',
  datetime: 'Date',
  datetime2: 'Date',
  datetimeoffset: 'string',
  smalldatetime: 'Date',
  time: 'string',
  uniqueidentifier: 'string',
  smallmoney: 'number',
  money: 'number',
  binary: 'blob',
  varbinary: 'blob',
  image: 'blob',
  xml: undefined,
  char: 'string',
  nchar: 'string',
  ntext: 'string',
  tvp: undefined,
  udt: undefined,
  geography: 'any',
  geometry: 'any',
  variant: undefined,
};

module.exports = function(sqltype) {
  return jstypes[sqltype.toLowerCase()];
}

