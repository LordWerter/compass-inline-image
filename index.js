
var fs    = require('fs');
var path  = require('path');
var types = require('node-sass').types;

var svg = function(buffer) {
    var svg = buffer.toString()
        .replace(/\n/g, '')
        .replace(/\r/g, '')
        .replace(/\#/g, '%23')
        .replace(/\"/g, "'");

    return '"data:image/svg+xml;utf8,' + svg + '"';
};

var img = function(buffer, ext) {
    return '"data:image/' + ext + ';base64,' + buffer.toString('base64') + '"';
};

module.exports = function(options) {
    options = options || {};

    var base = options.base || process.cwd();
    return {
        'inline-image($file)': function(file) {
            // we want to file relative to the base
            var relativePath = './' + file.getValue();
            var filePath = path.resolve(base, relativePath);

            // get the file ext
            var ext = filePath.split('.').pop();

            // read the file
            var data = fs.readFileSync(filePath);

            var buffer = new Buffer(data);

            if(ext === 'svg'){
              if(options.useBase64ForSVG){
                return types.String(img(buffer, "svg+xml"));
              }else{
                return types.String(svg(buffer, ext));
              }
            }else{
              return types.String(img(buffer, ext));
            }
        }
    };
};
