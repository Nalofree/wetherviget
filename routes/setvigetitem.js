var express = require('express');
var router = express.Router();
var weather = require('weather-js');
var path = require('path');
var Sequelize = require('sequelize');
var bodyParser = require('body-parser');

var weekday = [ "Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

var sequelize = new Sequelize('viget_db', 'viget_user', '12345Viget12345', {
  host: 'localhost',
  dialect: 'mysql',
  logging: true,
  storage: 'path/to/database.sqlite'
});
/* GET users listing. */
router.post('/', function (req,res,next) {
  var configs = sequelize.define('configs', {
      config_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      config_city: Sequelize.INTEGER,
      config_days: Sequelize.INTEGER,
      config_position: Sequelize.INTEGER
  });
  var codestring;
  configs.sync().then(function() {
    console.log('Success!');
    configs.create({
      config_city: req.body.city_id,
      config_days: req.body.days,
      config_position: req.body.position
    }).then(function (x) {
      codestring = "<iframe src='http://localhost:3000/viget/"+x.config_id;
      codestring += (req.body.position == 1) ? "' frameborder='0' width='470' height='220'></iframe>" : "' frameborder='0' width='260' height='470'></iframe>";
      res.send({
        insertid: x.config_id,
        code: codestring
      });
    }).catch(function (err) {
      console.log(err);
    });
  }).catch(function(err) {
    console.log('Database error: ' + err);
  });
})

module.exports = router;
