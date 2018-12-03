var fs = require('fs');
module.exports = (file) => {
  return fs.readFileSync(file, 'utf8');
}
