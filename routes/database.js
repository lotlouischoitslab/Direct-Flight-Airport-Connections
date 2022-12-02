var express = require('express');
var router = express.Router();
var mysql = require('mysql');

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
function renderDBPage(res, routes, currentUser = null, callProcedure = false) {
    con.query("SELECT * FROM Airports", function (err, airportresult, fields) {
        con.query("SELECT * FROM Airlines", function(err2, airlineresult) {
            // console.log(result);
            // console.log(result2);
            if (currentUser) {
                var select_search = `SELECT sh.SearchTime, sh.Source, sh.Destination, dest.Name as 'DestinationAirportName', source.Name as 'SourceAirportName' FROM update_history sh ` +
                                `INNER JOIN Airports dest on (sh.DestinationID = dest.AirportID) ` +
                                `INNER JOIN Airports source on (sh.SourceID = source.AirportID) ` +
                                `WHERE sh.Username="${currentUser}" ` +
                                `ORDER BY sh.SearchTime DESC`
                con.query(select_search, function (err2, searchresults) {
                    // console.log(searchresults)
                    if (callProcedure) {
                        con.query(`CALL new_procedure`, function (err6, procedureResult) {
                            if (err6) return err6;
                            console.log(procedureResult[0]);
                            res.render('database', { title: 'Express', airport_data: airportresult, airline_data: airlineresult, routes: routes, search_history: searchresults, procedure_result: procedureResult[0]});
                        });   
                    } else {
                        res.render('database', { title: 'Express', airport_data: airportresult, airline_data: airlineresult, routes: routes, search_history: searchresults, procedure_result: []});
                    }
                    
                });
            } else {
                // res.render('database', { title: 'Express', airport_data: airportresult, airline_data: airlineresult, routes: routes, search_history: [], procedure_result: procedureResult});
                if (callProcedure) {
                    con.query(`CALL new_procedure`, function (err6, procedureResult) {
                        if (err6) return err6;
                        console.log(procedureResult[0]);
                        res.render('database', { title: 'Express', airport_data: airportresult, airline_data: airlineresult, routes: routes, search_history: [], procedure_result: procedureResult[1]});
                    });   
                } else {
                    res.render('database', { title: 'Express', airport_data: airportresult, airline_data: airlineresult, routes: routes, search_history:  [], procedure_result: []});
                }
            }
            
        });
    });

    
}

function updateOrInsertSearch(searchfirst, sourceName, destinationName, currentUser) {
    // First check if our search database is not empty at the start
    if (currentUser) {
        if (searchfirst != null && Object.keys(searchfirst).length > 0) {
            //Let's first see if our search result for this already exists
            get_source_iata = `SELECT AirportID, IATA FROM Airports WHERE Name="${sourceName}"`
    
            con.query(get_source_iata, function (err3, sourceIATA) {
                if (err3) throw err3;
                get_dest_iata = `SELECT AirportID, IATA FROM Airports WHERE Name="${destinationName}"`
                con.query(get_dest_iata, function (err4, destIATA) {
                    if (err4) throw err4;
                    insert_query = `INSERT INTO Search_History (SearchID, Username, Source, SourceID, Destination, DestinationID)`
                    insert_query += ` VALUES (${1+searchfirst["SearchID"]}, "${currentUser}", "${sourceIATA[0].IATA}", ${sourceIATA[0].AirportID},"${destIATA[0].IATA}", ${destIATA[0].AirportID})`
                    con.query(insert_query, function (err5, insertresult) {
                        if (err5) return err5;

                        console.log("Inserting to search history");
                        console.log(insert_query);
                        console.log(insertresult);
                        
                    });
                });
            });   

            // searchQuery = `SELECT sh.Source, sh.SourceID, sh.Destination, sh.DestinationID, sh.SearchID from Search_History sh ` +
            // `INNER JOIN Airports source ON (source.AirportID = sh.SourceID) ` +
            // `INNER JOIN Airports dest ON (dest.AirportID = sh.DestinationID) ` +
            // ` WHERE source.Name="${sourceName}" AND dest.Name="${destinationName}" AND sh.Username="${currentUser}" ORDER BY sh.SearchID DESC`
            // con.query(searchQuery,function (err, searchRouteResult) {
            //     if (err) throw err;
            //     // console.log(searchRouteResult);
            //     if (searchRouteResult.length > 0) {
            //         // If the search results contain the query for the user, update the Search time
            //         console.log("Update query");
            //         update_query = `UPDATE Search_History ` +
            //         `SET SearchTime=CURRENT_TIMESTAMP() ` +
            //         `WHERE SourceID="${searchRouteResult[0].SourceID}" AND DestinationID="${searchRouteResult[0].DestinationID}" AND Username="${currentUser}"`
            //         con.query(update_query, function (err3) {
            //             console.log("Updating search history");
            //             if (err3) throw err3;
            //         });
            //     } else {
            //         get_source_iata = `SELECT AirportID, IATA FROM Airports WHERE Name="${sourceName}"`
    
            //         con.query(get_source_iata, function (err3, sourceIATA) {
            //             if (err3) throw err3;
            //             get_dest_iata = `SELECT AirportID, IATA FROM Airports WHERE Name="${destinationName}"`
            //             con.query(get_dest_iata, function (err4, destIATA) {
            //                 if (err4) throw err4;
            //                 insert_query = `INSERT INTO Search_History (SearchID, Username, Source, SourceID, Destination, DestinationID)`
            //                 insert_query += ` VALUES (${1+searchfirst["SearchID"]}, "${currentUser}", "${sourceIATA[0].IATA}", ${sourceIATA[0].AirportID},"${destIATA[0].IATA}", ${destIATA[0].AirportID})`
            //                 con.query(insert_query, function (err5, insertresult) {
            //                     console.log("Inserting to search history");
            //                     console.log(insert_query);
            //                     console.log(insertresult);
            //                 });
            //             });
            //         });   
            //     }
            // });
            
        } else {
            get_source_iata = `SELECT AirportID, IATA FROM Airports WHERE Name="${sourceName}"`
    
            con.query(get_source_iata, function (err3, sourceIATA) {
                if (err3) throw err3;
                get_dest_iata = `SELECT AirportID, IATA FROM Airports WHERE Name="${destinationName}"`
                con.query(get_dest_iata, function (err4, destIATA) {
                    if (err4) throw err4;
                    insert_query = `INSERT INTO Search_History (SearchID, Username, Source, SourceID, Destination, DestinationID)`
                    insert_query += ` VALUES (0, "${currentUser}", "${sourceIATA[0].IATA}", ${sourceIATA[0].AirportID},"${destIATA[0].IATA}", ${destIATA[0].AirportID})`
                    con.query(insert_query, function (err5) {
                        console.log("Inserting to search history");
                        con.query(`CALL new_procedure`, function (err6, procedureResult) {
                            if (err6) return err6;
                            console.log(procedureResult);
                            return procedureResult;
                        });
                    });
                });
            });
        }

        return [];
    }
    
}

router.get('/', function(req, res, next) {

    var currentUser = req.session.username;

    if (Object.keys(req.query).length !== 0) {
        var sourceAirport = req.query.source;
        var destinationAirport = req.query.destination;

        console.log(`Current user: ${currentUser}`);

        con.query(`SELECT SearchID FROM Search_History ORDER BY SearchID DESC`, function (err2, searchfirst) {
            if (err2) throw err2;
            // console.log(searchfirst);

            updateOrInsertSearch(searchfirst[0], sourceAirport, destinationAirport, currentUser);
            
            // console.log("Insert successfully complete");

            // var source_query = `SELECT AirportID from Airports WHERE Name="${sourceAirport}"`
            // var dest_query = `SELECT AirportID from Airports WHERE Name="${destinationAirport}"`
            // var query = `SELECT * FROM Routes r WHERE r.DestinationID=(${dest_query}) AND r.SourceID=(${source_query}) AND r.Stops=0`
            query = `SELECT r.Airline, r.SourceID, r.Source, r.DestinationID, r.Destination, source.Name as 'SourceAirportName', dest.Name as 'DestAirportName', air.Name as 'AirlineName' FROM Routes r ` +
            `INNER JOIN Airports source ON (source.AirportID = r.SourceID) ` +
            `INNER JOIN Airports dest ON (dest.AirportID = r.DestinationID) ` +
            `INNER JOIN Airlines air ON (r.AirlineID = air.AirlineID) ` +
            `WHERE source.Name="${sourceAirport}" AND dest.Name="${destinationAirport}" AND r.Stops=0`
            // console.log(query);
            con.query(query, function (err, result, fields) {
                if (err) throw err;
                // console.log(result);
                renderDBPage(res, result, currentUser, true); 
            });
        });

        
    }
    else {
        renderDBPage(res, [], currentUser);
    }

    console.log("Running");
    
});

router.get('/deleteFromSearch', function(req, res, next) {
    console.log("Running");
    var sourceAirport = req.query.source;
    var destinationAirport = req.query.destination;
    var currentUser = req.session.username;

    if (currentUser) {
        // TODO: Replace yugm2 with the username of the current user
    query = `SELECT sh.Source, sh.Destination, dest.Name as 'DestinationAirportName', source.Name as 'SourceAirportName' FROM update_history sh ` +
    `INNER JOIN Airports dest on (sh.DestinationID = dest.AirportID) ` +
    `INNER JOIN Airports source on (sh.SourceID = source.AirportID) ` +
    `WHERE sh.Username="${currentUser}" AND source.Name="${sourceAirport}" AND dest.Name="${destinationAirport}" ` +
    `ORDER BY SearchTime DESC`
    console.log(query);
    con.query(query, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    delete_query = `DELETE FROM update_history WHERE Source="${result[0].Source}" AND Destination="${result[0].Destination}"`
    con.query(delete_query, function (err2, result, fields) {
        if (err2) throw err2;
        console.log("deletion successful");
    })
    });
    }
    
});

module.exports = router;