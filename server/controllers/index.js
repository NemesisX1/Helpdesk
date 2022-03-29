var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/auth/callback', function(req, res, next){
  console.log(req.body);
  const frontend_url = process.env.FRONTEND_URL || 'http://localhost:8080'
  res.redirect(`${frontend_url}/home`)
});


router.get('/test/:id/comment', function(req, res, next){
    
    res.status(200).send("Ok")
});
module.exports = router;
