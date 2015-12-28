import thinky from "../../config/thinky";

let { r, type } = thinky

let Article = thinky.createModel('Article', {
  title: String,
  url: String,
  text: String
});

module.exports = Article
// example on how to add relations
// var Comment = require('./comment');
// Article.hasMany(Comment, 'comments', 'id', 'article_id');

