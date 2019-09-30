const fs = require('fs');
const extractModelFromMSSQL = require('./extractModelFromMSSQL');
const genEntity = require('./entity.generator');
const genInterface = require('./interface.generator');
const genService = require('./service.generator');
const genDto = require('./dto.generator');
const genModule = require('./module.generator');
const genProvider = require('./provider.generator');
const genController = require('./controller.generator');
//called with

const filePath = process.argv.slice(2)[0];
console.log(process.argv)
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) throw err;
  const model = extractModelFromMSSQL(data);
  const folderName = `${model.name}-${new Date().toDateString()}`;
  fs.mkdirSync(`${__dirname}/generated_files/${folderName}`);
  write(`${model.name}.entity.ts`, folderName, genEntity(model));
  write(`${model.name}.interface.ts`, folderName, genInterface(model));
  write(`${model.name}.dto.ts`, folderName, genDto(model));
  write(`${model.name}.module.ts`, folderName, genModule(model));
  write(`${model.name}.provider.ts`, folderName, genProvider(model));
  write(`${model.name}.service.ts`, folderName, genService(model));
  write(`${model.name}.controller.ts`, folderName, genController(model));
});

function write(name, folder, content) {
  fs.writeFile(`${__dirname}/generated_files/${folder}/${name}`, content, (err) => {

    if (err) {
        console.error(err);
        return;
    };

    console.log(`${name} File has been created`);
  });
}
