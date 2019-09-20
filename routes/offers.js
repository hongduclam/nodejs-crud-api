var express = require('express');
var _ = require('lodash');
const fs = require('fs');

let rawdata = fs.readFileSync('data/offer.json');
let posts = JSON.parse(rawdata);

var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  // res.send('respond with a resource');
  res.json(posts);
});

router.post('/', function (req, res) {
  const data = req.body;
  console.log(data);
  data.id = posts.length;
  posts.push(data);
  return res.json(data);
  // ...
});

router.get('/:id', function (req, res, next) {
  const rs = posts.filter(function (t) {
    return t.id == req.params.id;
  });
  return res.json(rs.length > 0 ? rs[0] : {});
});

router.put('/:id', function (req, res, next) {
  const index = _.findIndex(posts, function (item) {
    return item.id == req.params.id;
  });
  console.log(req.body);
  const data = req.body;
  posts[index] = {
    ...data,
    id: req.params.id
  };
  return res.json(data);
});

router.delete('/:id', function (req, res, next) {
  _.remove(posts, function (item) {
    return item.id == req.params.id;
  });
  return res.json({id: req.params.id});
});

module.exports = router;
