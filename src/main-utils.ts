import importLocations from './data-utilities/importLocations';


switch(process.argv[2]) {
  case 'LocationTimestamp':
    importLocations(process.argv[3]);
    break;
  default:
    console.log('do nothing');
}
