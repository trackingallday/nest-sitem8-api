export default function importLocations(filename) {
  console.log('pop')
}


/*import * as csv from 'csvtojson';
import { bootstrap } from '../main';
import * as fs from 'fs';
import * as parse from 'wellknown';
import { LocationTimestamp } from '../locationTimestamp/locationTimestamp.entity';
import { Sequelize } from 'sequelize-typescript';
import constants from '../constants';
const { uncapitalise } = require('../utils/strUtils');

function chunkArray(myArray, chunk_size){
  var index = 0;
  var arrayLength = myArray.length;
  var tempArray = [];
  for (index = 0; index < arrayLength; index += chunk_size) {
      var myChunk = myArray.slice(index, index+chunk_size);
      // Do something if you want with the group
      tempArray.push(myChunk);
  }
  return tempArray;
}

async function saveData(rows) {
  console.log('saving ' + rows.length + 'records');
  return new Promise((res) => {
    rows.forEach(async lt => {
      const geoj = parse(lt['(No column name)']);
      lt.geom = geoj;
      delete lt['(No column name)'];
      const newProps = {};
      const lte = new LocationTimestamp();
      Object.keys(lt).forEach(k => {
        const newK = uncapitalise(k);
        const newKey = newK.replace('ID', 'Id');
        const newVal = lt[k] === 'NULL' ? null : lt[k];
        newProps[newKey] = newVal;
      });
      lte.set(newProps);
      await lte.save();
      res(lte.id);
    });
  });
}


const { database, password, provide, username } = constants.db.dev;
const sequelize = new Sequelize(database, username, password, {
  dialect: 'postgres',
});
sequelize.addModels([
  LocationTimestamp,
]);

async function doImport(filename) {
  console.log(`${__dirname}\\seed-data\\${filename}`);
  fs.readFile(`${__dirname}\\seed-data\\${filename}`, 'utf8', async (err, data) => {
    if(err) {
      console.error(err);
      return;
    }
    csv().fromString(data).then(async csvRows => {
      const chunks = chunkArray(csvRows, 1000);
      for(var i  = 0; i < chunks.length; i ++) {
        await saveData(chunks[i]);
      }
    });
  });
}

export default function importLocations(filename) {
  doImport(filename);
}*/
