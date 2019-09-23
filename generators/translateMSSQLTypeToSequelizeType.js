/* from Sequelize docs for POSTGRES
STRING                      // VARCHAR(255)
TEXT                        // TEXT
INTEGER                     // INTEGER
BIGINT                      // BIGINT
FLOAT                       // FLOAT
DOUBLE                      // DOUBLE
DECIMAL                     // DECIMAL
DATE                        // DATETIME for mysql / sqlite, TIMESTAMP WITH TIME ZONE for postgres
BOOLEAN                     // TINYINT(1)
BLOB                        // BLOB (bytea for PostgreSQL)
UUID                        // UUID datatype for PostgreSQL and SQLite, CHAR(36) BINARY for MySQL (use defaultValue: UUIDV1 or UUIDV4 to make sequelize generate the ids automatically)
GEOMETRY                    // Spatial column.  PostgreSQL (with PostGIS) or MySQL only.
*/

var sequelizetypes = {
  varchar: 'STRING',
  nvarchar: 'STRING',
  text: 'TEXT',
  int: 'INTEGER',
  bigint: 'BIGINT',
  tinyint: 'BOOLEAN',
  smallint: 'number',
  bit: 'BOOLEAN',
  float: 'FLOAT',
  numeric: 'FLOAT',
  decimal: 'DECIMAL',
  real: 'REAL',
  date: 'DATE',
  datetime: 'DATE',
  datetime2: 'DATE',
  datetimeoffset: 'STRING',
  smalldatetime: 'DATE',
  time: 'STRING',
  uniqueidentifier: 'UUID',
  smallmoney: 'FLOAT',
  money: 'FLOAT',
  binary: 'BLOB',
  varbinary: 'BLOB',
  image: 'BLOB',
  xml: undefined,
  char: 'STRING',
  nchar: 'STRING',
  ntext: 'TEXT',
  tvp: undefined,
  udt: undefined,
  geography: 'GEOMETRY',
  geometry: 'GEOMETRY',
  variant: undefined,
};

module.exports = function(sqltype) {
  return sequelizetypes[sqltype.toLowerCase()];
}
