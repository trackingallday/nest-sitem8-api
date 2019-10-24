function capitalise(str) {
  return str.replace(/\b\w/g, l => l.toUpperCase());
}

function uncapitalise(str) {
  return str.replace(/\b\w/g, l => l.toLowerCase());
}

function stripNonAlphaNumeric(str) {
  return str.replace(/\W/g, '');
}

module.exports = {
  capitalise,
  uncapitalise,
  stripNonAlphaNumeric,
}
