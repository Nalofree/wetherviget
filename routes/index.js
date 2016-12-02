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

router.use(express.static(path.join(__dirname, 'public')));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

/*Define sequelize tables*/
// var citys = sequelize.define('citys', {
//     city_id: {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     city_name: Sequelize.TEXT,
//     city_alias: Sequelize.TEXT
// })
// var configs = sequelize.define('configs', {
//     config_id: {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     config_city: Sequelize.INTEGER,
//     config_days: Sequelize.INTEGER,
//     config_position: Sequelize.INTEGER
// });

/* GET home page. */
router.route('/')
  .get(function(req, res, next) {
  //res.render('index', { title: 'Express' });
  var cityslist, configlist;
  // weather.find({search: 'Moscow, Russia', degreeType: 'C', "imagerelativeurl": "http://blob.weather.microsoft.com/static/weather4/ru-ru/"}, function(err, result) {
  //   if(err) console.log(err);
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

      citys.sync().then(function() {
        console.log('Success!');
        // citys.create({
        //   city_name: 'Moscow',
        //   city_alias: 'Москва'
        // });
        // citys.create({
        //   city_name: 'Nizhny Novgorod',
        //   city_alias: 'Нижний Новгород'
        // });
        // citys.create({
        //   city_name: 'Saint Petersburg',
        //   city_alias: 'Санкт-Петербург'
        // });
        citys.findAll().then(function (cityslist) {
          //console.log('find Success!', cityslist);
          //res.send(cityslist);
          weather.find({search: cityslist[0].city_name+', Russia', degreeType: 'C', "imagerelativeurl": "http://blob.weather.microsoft.com/static/weather4/ru-ru/"}, function(err, result) {
            if(err) console.log(err);
            //console.log(result[0].forecast[0]);
            res.render('index',
            { result: result,
              cityslist: cityslist }
            );
          });
        }).catch(function (err) {
          console.log('Database error: ' + err);
        });
        console.log(cityslist);
      }).catch(function(err) {
        console.log('Database error: ' + err);
      });
    }).catch(function(err) {
      console.log('Connection error: ' + err);
    });
    // res.render('index', result, cityslist);
    // res.send(cityslist);
    //console.log(JSON.stringify(result, null, 2));
  // });
})
.post(function (req, res, next) {
  console.log(req.body.city_id);
  var citys = sequelize.define('citys', {
      city_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      city_name: Sequelize.TEXT,
      city_alias: Sequelize.TEXT
  });
  citys.sync().then(function() {
    console.log('Success!');
    citys.findOne({where:{city_id: req.body.city_id}}).then(function (cityItem) {
      console.log('find Success!', cityItem);
      //res.send(cityslist);
      weather.find({search: cityItem.city_name+', Russia', degreeType: 'C', "imagerelativeurl": "http://blob.weather.microsoft.com/static/weather4/ru-ru/"}, function(err, result) {
        if(err) console.log(err);
        // console.log(result.forecast);
        // console.log("req.body: ",req.body);
        var dayNames = [];
        var cloentResults = [];
        var d = 0;
        // console.log(weekday[req.body.today]);
        var resultsForDays = result[0].forecast;
        resultsForDays.forEach(function(item, i) {
          if (resultsForDays[i].day === weekday[req.body.today]) {
            // console.log( item );
            while (d < req.body.days) {
              cloentResults.push(resultsForDays[i+d]);
              d++;
            }
          }
        });
        res.send({
          result: cloentResults
        });
      });
    }).catch(function (err) {
      console.log('Database error: ' + err);
    });
  }).catch(function(err) {
    console.log('Database error: ' + err);
  });
});



// router.get('/', function (req,res,next) {
//   var configs = sequelize.define('configs', {
//       config_id: {
//           type: Sequelize.INTEGER,
//           primaryKey: true,
//           autoIncrement: true
//       },
//       config_city: Sequelize.INTEGER,
//       config_days: Sequelize.INTEGER,
//       config_position: Sequelize.INTEGER
//   });
//   configs.sync().then(function() {
//     console.log('Success!');
//     configs.create({
//       config_city: req.body.city_id,
//       config_days: req.body.days,
//       config_position: req.body.position
//     }).then(function (x) {
//       res.send({
//         insertid: x
//       });
//     }).catch(function (err) {
//       console.log(err);
//     });
//   }).catch(function(err) {
//     console.log('Database error: ' + err);
//   });
// })

module.exports = router;
