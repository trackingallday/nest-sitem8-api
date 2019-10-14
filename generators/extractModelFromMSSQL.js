const utils = require('../src/utils/strUtils');
const translateMSSQLType = require('./translateMSSQLTypeToJsType');
const translateMSSQLTypeToSequelizeType = require('./translateMSSQLTypeToSequelizeType');
const translateJSTypeToValidator = require('./translateJSTypeToValidator');
const { stripNonAlphaNumeric, uncapitalise } = utils;
/*
  extracts text from mssql create table returns object like
  {
    name: 'cat',
    attributes: [
      {
        name: 'name', sqltype: 'nvarchar', text: '[Name] [nvarchar](50) NOT NULL',
        jsType: 'string', sqlizeType: 'STRING', validator: IsString
      },
      {
        age: 1, sqltype: 'int', text: '[Age] [int] NOT NULL',
        jsType: 'number', sqlizeType: 'INTEGER', validator: 'IsNumber'
      },
    ]
  }
*/

function extractModelName(sql) {
  const lines = sql.split('\n');
  const modelNameLine = lines.find(l => l.includes('CREATE TABLE'))
  const tableName = modelNameLine.match(/\[(.*)\]/)[0];
  return uncapitalise(stripNonAlphaNumeric(tableName.split('.').reverse()[0]));
}

function extractAttributes(sql) {
  const attrLines = sql.split('\n').filter(l => /\](\s)\[/.test(l));
  return attrLines.map((l) => {
    const name = uncapitalise(stripNonAlphaNumeric(l.split('] [')[0]));
    const sqltype = stripNonAlphaNumeric(l.split('] [')[1].split(']')[0]);
    const jsType = translateMSSQLType(sqltype);
    const validator = translateJSTypeToValidator(jsType);
    const sqlizeType = translateMSSQLTypeToSequelizeType(sqltype);
    return { name, sqltype, text: l.trim(), jsType, sqlizeType, validator };
  });

}

module.exports = function extractModelFromSql(sql) {
  const model = {
    name: extractModelName(sql),
    attributes: extractAttributes(sql),
  }
  return model;
}
