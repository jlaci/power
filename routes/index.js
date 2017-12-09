var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var _ = require('lodash');



var conn = mysql.createConnection({
  host: process.argv[2],
  user: process.argv[3],
  password: process.argv[4]
});

conn.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

function parseDailyDataTotal(raw) {
  var data = {
    labels: [],
    datasets: [
      {
        label: "Total",
        data: [],
        borderColor: "#0082c8",
        backgroundColor: "#0082c866"
      }
    ]
  };

  _.forEach(raw, function (day) {
    data.labels.push(day.datum);
    var sum = day.zona1 + day.zona2 + day.zona3 + day.zona4 + day.zona5 + day.zona6 + day.zona7 + day.zona8 + day.zona9 + day.zona10;
    data.datasets[0].data.push(sum);
  });

  return data;
}

function parseDailyDataZone(raw) {
  var data = {
    labels: [],
    datasets: [
      {
        label: "Zóna 1",
        data: [],
        backgroundColor: "#e6194b88",
        borderColor: "#e6194b"
      },
      {
        label: "Zóna 2",
        data: [],
        backgroundColor: "#3cb44b88",
        borderColor: "#3cb44b"
      },
      {
        label: "Zóna 3",
        data: [],
        backgroundColor: "#ffe11988",
        borderColor: "#ffe119"
      },
      {
        label: "Zóna 4",
        data: [],
        backgroundColor: "#0082c888",
        borderColor: "#0082c8"
      },
      {
        label: "Zóna 5",
        data: [],
        backgroundColor: "#f5823188",
        borderColor: "#f58231"
      },
      {
        label: "Zóna 6",
        data: [],
        backgroundColor: "#911eb488",
        borderColor: "#911eb4"
      },
      {
        label: "Zóna 7",
        data: [],
        backgroundColor: "#46f0f088",
        borderColor: "#46f0f0"
      },
      {
        label: "Zóna 8",
        data: [],
        backgroundColor: "#f032e688",
        borderColor: "#f032e6"
      },
      {
        label: "Zóna 9",
        data: [],
        backgroundColor: "#00808088",
        borderColor: "#008080"
      },
      {
        label: "Zóna 10",
        data: [],
        backgroundColor: "#aa6e2888",
        borderColor: "#aa6e28"
      }
    ]
  };

  _.forEach(raw, function (day) {
    data.labels.push(day.datum);
    data.datasets[0].data.push(day.zona1);
    data.datasets[1].data.push(day.zona2);
    data.datasets[2].data.push(day.zona3);
    data.datasets[3].data.push(day.zona4);
    data.datasets[4].data.push(day.zona5);
    data.datasets[5].data.push(day.zona6);
    data.datasets[6].data.push(day.zona7);
    data.datasets[7].data.push(day.zona8);
    data.datasets[8].data.push(day.zona9);
    data.datasets[9].data.push(day.zona10);
  });

  return data;
}

/* GET home page. */
router.get('/', function(req, res, next) {

  conn.query('SELECT * FROM consumption.napi_fogyasztas ORDER BY datum ASC;', function (error, dailyResults) {
    if (error) throw error;
    var dailyDataTotal = parseDailyDataTotal(dailyResults);
    var dailyDataZone = parseDailyDataZone(dailyResults);
    res.render('index',
      {
        startDate: dailyResults[0].datum,
        endDate: _.last(dailyResults).datum,
        dailyDataTotal: JSON.stringify(dailyDataTotal),
        dailyDataZone:  JSON.stringify(dailyDataZone)
      });
  });
});

module.exports = router;
