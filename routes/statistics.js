var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('statistics', { title: 'Express', fas: 'fa-times'});
});


var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const { search } = require('./database');
var plotly = require('plotly')("yugmittal712", "FPZSPfukqPlr21sOEFMW")

/* GET home page. */
// var con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "Risha1234$",
//     database: "CS411DB"
// });



var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "CS411sql-YM!",
    database: "yugmdb"
});

/**
 * 
 * @param {*} res -- The page we render our result to
 * @param {*} routes -- The list of routes we output to our page
 */
function renderDBPage(res, airportName, cityName) {
    con.query("SELECT * FROM Airports", function (err, airportresult, fields) {
        con.query("SELECT DISTINCT City FROM Airports;", function(err2, cityresult) {
            // console.log(result);
            // console.log(result2);
            var advanced_one = `SELECT Name as Airport, sub1.airlineName as Airline, MAX(num) as Total ` + 
	`FROM ` + 
	`(SELECT al.AirlineID, al.Name airlineName, a.Name airportName, COUNT(*) num ` +
	`FROM Routes r JOIN Airports a ON r.SourceID = a.AirportID ` +
		`JOIN Airlines al ON r.AirlineID = al.AirlineID ` +
	`GROUP BY al.AirlineID, a.Name ` +
	`ORDER BY num DESC) sub1 ` +
    `JOIN ` + 
    `(SELECT a.Name FROM Routes r JOIN Airports a ON r.SourceID = a.AirportID ` + 
    `WHERE a.Name = "${airportName}") ` + 
    `sub2 ON sub2.Name = sub1.airportName ` +
	`GROUP BY Name, airlineName ` +
	`LIMIT 15;`
	
	
	
		var advanced_two = `(SELECT a2.City City, a2.Country Country, ISO Abv ` + 
`FROM Routes r JOIN Airports a1 ON r.SourceID = a1.AirportID ` + 
`JOIN Airports a2 ON r.DestinationID = a2.AirportID ` +
`JOIN Countries c ON c.Name= a2.Country ` + 
`WHERE r.Stops = "0" AND a1.City = "${cityName}") ` + 
`UNION ` + 
`(SELECT a1.City City, a1.Country Country, ISO Abv FROM Routes r JOIN Airports a1 ON r.SourceID = a1.AirportID ` + 
`JOIN Airports a2 ON r.DestinationID = a2.AirportID ` + 
`JOIN Countries c ON c.Name = a1.Country WHERE r.Stops = "0" AND a2.City = "${cityName}") ORDER BY City ` + 
`LIMIT 15;`
	
            // var select_search = `SELECT sh.SearchTime, sh.Source, sh.Destination, dest.Name as 'DestinationAirportName', source.Name as 'SourceAirportName' FROM Search_History sh ` +
//                                 `INNER JOIN Airports dest on (sh.DestinationID = dest.AirportID) ` +
//                                 `INNER JOIN Airports source on (sh.SourceID = source.AirportID) ` +
//                                 `WHERE sh.Username="yugm2" ` +
//                                 `ORDER BY sh.SearchTime DESC`
            con.query(advanced_one, function (err2, searchresults) {
                console.log(searchresults["Airport"]);
                console.log(searchresults["Total"])
                var airlines = []
                var freq = []
                for (var i = 0; i < searchresults.length; i++) {
                    airlines.push(searchresults[i]["Airline"]);
                    freq.push(searchresults[i]["Total"])
                }
                if (searchresults.length > 0) {
                    var data = [
                    {
                        x: airlines,
                        y: freq,
                        type: "bar",
                    }
                    ];
                    var layout = {
                        title: `Top 15 most commonly used airlines from ${searchresults[0]["Airport"]}`,
                        xaxis: {title: "Airline"},
                        yaxis: {
                          title: "Frequency",
                          titlefont: {
                            size: 16,
                            color: "rgb(107, 107, 107)"
                          },
                          tickfont: {
                            size: 14,
                            color: "rgb(107, 107, 107)"
                          }
                        },
                        legend: {
                          x: 0,
                          y: 1.0,
                          bgcolor: "rgba(255, 255, 255, 0)",
                          bordercolor: "rgba(255, 255, 255, 0)"
                        },
                        barmode: "group",
                        bargap: 0.15,
                        bargroupgap: 0.1
                      };
                    var graphOptions = {layout: layout, filename: "commonly-used-airports", fileopt: "overwrite"};
                    plotly.plot(data, graphOptions, function (err, msg) {
                        console.log(msg);
                    });
                }
                

                console.log(searchresults);
                console.log(cityresult);
                con.query(advanced_two, function (err2, searchresults_two){
                	res.render('statistics', { title: 'Express', airport_data: airportresult, airport_data: airportresult, city_data: cityresult,  routes: searchresults, cities: searchresults_two, search_history: searchresults});
                });
                // res.render('statistics', { title: 'Express', airport_data: airportresult, airport_data: airportresult, city_data: cityresult,  routes: searchresults, cities: searchresults_two, search_history: searchresults});
            });
            
            
        });
    });
}

// function updateOrInsertSearch(searchfirst, sourceName, destinationName) {
//     // First check if our search database is not empty at the start
//     if (searchfirst != null && Object.keys(searchfirst).length > 0) {
//         //Let's first see if our search result for this already exists
//         searchQuery = `SELECT sh.Source, sh.SourceID, sh.Destination, sh.DestinationID, sh.SearchID from Search_History sh ` +
//         `INNER JOIN Airports source ON (source.AirportID = sh.SourceID) ` +
//         `INNER JOIN Airports dest ON (dest.AirportID = sh.DestinationID) ` +
//         ` WHERE source.Name="${sourceName}" AND dest.Name="${destinationName}" AND sh.Username="yugm2" ORDER BY sh.SearchID DESC`
//         con.query(searchQuery,function (err, searchRouteResult) {
//             if (err) throw err;
//             console.log(searchRouteResult);
//             if (searchRouteResult.length > 0) {
//                 // If the search results contain the query for the user, update the Search time
//                 console.log("Update query");
//                 update_query = `UPDATE Search_History ` +
//                 `SET SearchTime=CURRENT_TIMESTAMP() ` +
//                 `WHERE SourceID="${searchRouteResult[0].SourceID}" AND DestinationID="${searchRouteResult[0].DestinationID}" AND Username="yugm2"`
//                 con.query(update_query, function (err3) {
//                     console.log("Updating search history");
//                     if (err3) throw err3;
//                 });
//             } else {
//                 get_source_iata = `SELECT AirportID, IATA FROM Airports WHERE Name="${sourceName}"`
// 
//                 con.query(get_source_iata, function (err3, sourceIATA) {
//                     if (err3) throw err3;
//                     get_dest_iata = `SELECT AirportID, IATA FROM Airports WHERE Name="${destinationName}"`
//                     con.query(get_dest_iata, function (err4, destIATA) {
//                         if (err4) throw err4;
//                         insert_query = `INSERT INTO Search_History (SearchID, Username, Source, SourceID, Destination, DestinationID)`
//                         insert_query += ` VALUES (${1+searchfirst["SearchID"]}, "yugm2", "${sourceIATA[0].IATA}", ${sourceIATA[0].AirportID},"${destIATA[0].IATA}", ${destIATA[0].AirportID})`
//                         con.query(insert_query, function (err5) {
//                             console.log("Inserting to search history");
//                         });
//                     });
//                 });   
//             }
//         });
//         
//     } else {
//         get_source_iata = `SELECT AirportID, IATA FROM Airports WHERE Name="${sourceName}"`
// 
//         con.query(get_source_iata, function (err3, sourceIATA) {
//             if (err3) throw err3;
//             get_dest_iata = `SELECT AirportID, IATA FROM Airports WHERE Name="${destinationName}"`
//             con.query(get_dest_iata, function (err4, destIATA) {
//                 if (err4) throw err4;
//                 insert_query = `INSERT INTO Search_History (SearchID, Username, Source, SourceID, Destination, DestinationID)`
//                 insert_query += ` VALUES (0, "yugm2", "${sourceIATA[0].IATA}", ${sourceIATA[0].AirportID},"${destIATA[0].IATA}", ${destIATA[0].AirportID})`
//                 con.query(insert_query, function (err5) {
//                     console.log("Inserting to search history");
//                 });
//             });
//         });
//     }
// }

router.get('/', function(req, res, next) {

    if (Object.keys(req.query).length !== 0) {
        var airport = req.query.airport;
        var city = req.query.city;
		renderDBPage(res, airport, city);
        // con.query(`SELECT SearchID FROM Search_History ORDER BY SearchID DESC`, function (err2, searchfirst) {
//             if (err2) throw err2;
//             console.log(searchfirst);
// 
//             updateOrInsertSearch(searchfirst[0], sourceAirport, destinationAirport);
//             
//             console.log("Insert successfully complete");
// 
//             // var source_query = `SELECT AirportID from Airports WHERE Name="${sourceAirport}"`
//             // var dest_query = `SELECT AirportID from Airports WHERE Name="${destinationAirport}"`
//             // var query = `SELECT * FROM Routes r WHERE r.DestinationID=(${dest_query}) AND r.SourceID=(${source_query}) AND r.Stops=0`
//             query = `SELECT r.Airline, r.SourceID, r.Source, r.DestinationID, r.Destination, source.Name as 'SourceAirportName', dest.Name as 'DestAirportName', air.Name as 'AirlineName' FROM Routes r ` +
//             `INNER JOIN Airports source ON (source.AirportID = r.SourceID) ` +
//             `INNER JOIN Airports dest ON (dest.AirportID = r.DestinationID) ` +
//             `INNER JOIN Airlines air ON (r.AirlineID = air.AirlineID) ` +
//             `WHERE source.Name="${sourceAirport}" AND dest.Name="${destinationAirport}" AND r.Stops=0`
//             console.log(query);
//             con.query(query, function (err, result, fields) {
//                 if (err) throw err;
//                 console.log(result);
//                 renderDBPage(res, result); 
//             });
//         });

        
    }
    else {
        renderDBPage(res, [], []);
    }

    console.log("Running");
    
});

// router.get('/deleteFromSearch', function(req, res, next) {
//     console.log("Running");
//     var sourceAirport = req.query.source;
//     var destinationAirport = req.query.destination;
// 
//     // TODO: Replace yugm2 with the username of the current user
//     query = `SELECT sh.Source, sh.Destination, dest.Name as 'DestinationAirportName', source.Name as 'SourceAirportName' FROM Search_History sh ` +
//             `INNER JOIN Airports dest on (sh.DestinationID = dest.AirportID) ` +
//             `INNER JOIN Airports source on (sh.SourceID = source.AirportID) ` +
//             `WHERE sh.Username="yugm2" AND source.Name="${sourceAirport}" AND dest.Name="${destinationAirport}" ` +
//             `ORDER BY SearchTime DESC`
//     console.log(query);
//     con.query(query, function (err, result, fields) {
//         if (err) throw err;
//         console.log(result);
//         delete_query = `DELETE FROM Search_History WHERE Source="${result[0].Source}" AND Destination="${result[0].Destination}"`
//         con.query(delete_query, function (err2, result, fields) {
//             if (err2) throw err2;
//             console.log("deletion successful");
//         })
//     });
// });

module.exports = router;



module.exports = router;
