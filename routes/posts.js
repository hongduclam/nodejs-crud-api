var express = require('express');
var _ = require('lodash');
var router = express.Router();
let posts = [
  { id: 1, volume: '121,608,235', last: '31.79', description: 'WILLIAMS COS INC DEL', change: '0.00 (+0.00%)' },
  { id: 2, volume: '55,679,849', last: '31.79', description: 'BANK AMER CORP', change: '-0.41 (-1.30%)' }
];

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
  res.send('ok');
  // ...
});

router.get('/:id', function (req, res, next) {
  const rs = posts.filter(function (t) {
    return t.id == req.params.id;
  });
  res.json(rs.length > 0 ? rs[0] : {});
});

router.patch('/:id', function (req, res, next) {
  const index = _.findIndex(posts, function (item) {
    return item.id == req.params.id;
  });
  const data = req.body;
  posts[index] = data;
  res.json(data);
});

router.delete('/:id', function (req, res, next) {
  _.remove(posts, function (item) {
    return item.id == req.params.id;
  });
  res.json(posts);
});

module.exports = router;
