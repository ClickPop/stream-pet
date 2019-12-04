var express = require('express');
var router = express.Router();

var currentState = {};

router.setCurrentState = (data) => {
    if (data !== null && typeof data === 'object') {
        currentState = data;
    }
}

/* GET home page. */
router.get('/', function(req, res, next) {
    var data = currentState;
    res.json(data);
});

module.exports = router;
