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
router.post('/:vigetid?', function(req, res, next) {
  if (req.params.vigetid) {
    // res.send(req.params.vigetid);
    // params = {}
    // res.render('vigetitem', params);
    sequelize.authenticate().then(function() {
      console.log('Connect to DB created!');
      var citys = sequelize.define('citys', {
          city_id: {
              type: Sequelize.INTEGER,
              primaryKey: true,
              autoIncrement: true
          },
          city_name: Sequelize.TEXT,
          city_alias: Sequelize.TEXT
      });
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

      configs.sync().then(function() {
        console.log('Success!');
        configs.findOne({
            where: {
                config_id: req.params.vigetid
            }
        }).then(function (configs) {
          configs.update({
            config_city: req.body.city_id,
            config_days: req.body.days,
            config_position: req.body.position
            }, {
            where: {
              config_id: req.params.vigetid
            }
          }).then(function () {
            citys.findAll().then(function (cityslist) {
              //console.log('find Success!', cityslist);
              //res.send(cityslist);
              weather.find({search: cityslist[0].city_name+', Russia', degreeType: 'C', "imagerelativeurl": "http://blob.weather.microsoft.com/static/weather4/ru-ru/"}, function(err, result) {
                if(err) console.log(err);
                //console.log(result[0].forecast[0]);
                res.send(
                { result: result,
                  cityslist: cityslist,
                  configs: configs }
                );
              });
            }).catch(function (err) {
              console.log('Database error: ' + err);
            });
          }).catch(function (err) {
            console.log(err);
          });
        }).catch(function (err) {
          console.log(err);
        });
      }).catch(function(err) {
        console.log('Database error: ' + err);
      });
    }).catch(function(err) {
      console.log('Connection error: ' + err);
    });
  }else{
    res.send('Ошибка виджета');
  }
});

module.exports = router;
