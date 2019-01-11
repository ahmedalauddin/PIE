var express = require('express');
var router = express.Router();



// This middle-ware will get the id param
// check if its 0 else go to next router.
router.use("/user/:id",function(req,res,next){
  if(req.params.id == 0) {
    res.json({"message" : "You must pass ID other than 0"});
  }
  else next();
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

