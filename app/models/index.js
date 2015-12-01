import Glob from 'glob'
import config from "../../config";
import Thinky from "../../config/thinky";

let models = {
  r: Thinky.r
};

let files = Glob.sync(config.root + '/app/models/!(index)*.js');
files.forEach(function (file) {
  let model = require(file);
  models[model.getTableName()] = model;
});


module.exports = models;
