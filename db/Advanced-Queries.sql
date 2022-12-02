-- Example Usage: All the cities someone can directly fly to from Chicago
(SELECT a2.City City, a2.Country Country, ISO Abv
FROM Routes r JOIN Airports a1 ON r.SourceID = a1.AirportID 
	JOIN Airports a2 ON r.DestinationID = a2.AirportID
	JOIN Countries c ON c.Name= a2.Country
WHERE r.Stops = "0" AND a1.City = "Chicago")
UNION
(SELECT a1.City City, a1.Country Country, ISO Abv
FROM Routes r JOIN Airports a1 ON r.SourceID = a1.AirportID
	JOIN Airports a2 ON r.DestinationID = a2.AirportID
    JOIN Countries c ON c.Name = a1.Country
WHERE r.Stops = "0" AND a2.City = "Chicago")
ORDER BY City
LIMIT 15;

-- Grab the top 15 most used airlines at an airport
-- Example Usage: Grab the top 15 airlines at the busiest airport in the world
SELECT Name as Airport, sub1.airlineName as Airline, MAX(num) as Total
FROM 
	(SELECT al.AirlineID, al.Name airlineName, a.Name airportName, COUNT(*) num
	FROM Routes r JOIN Airports a ON r.SourceID = a.AirportID 
		JOIN Airlines al ON r.AirlineID = al.AirlineID
	GROUP  BY al.AirlineID, a.Name
	ORDER  BY num DESC) sub1 
    JOIN 
    (SELECT a.Name
	FROM Routes r JOIN Airports a ON r.SourceID = a.AirportID
    WHERE a.Name = 'Dallas Fort Worth International Airport')
    sub2 ON sub2.Name = sub1.airportName
GROUP BY Name, airlineName 
LIMIT 15; 







--- Analyze for part 3
-- Perform the Explain Analyze --
-- Don't forget to rename database1 to louislocaldatabase
DROP INDEX idx_airportid ON airports;
CREATE INDEX idx_airportid ON airports (AirportID);
EXPLAIN ANALYZE (SELECT a2.City City, a2.Country Country, ISO Abv
FROM louislocaldatabase.Routes r JOIN louislocaldatabase.Airports a1 ON r.SourceID = a1.AirportID 
	JOIN louislocaldatabase.Airports a2 ON r.DestinationID = a2.AirportID
	JOIN louislocaldatabase.Countries c ON c.Name= a2.Country
WHERE r.Stops = "0" AND a1.City = "Chicago")
UNION
(SELECT a1.City City, a1.Country Country, ISO Abv
FROM louislocaldatabase.Routes r JOIN louislocaldatabase.Airports a1 ON r.SourceID = a1.AirportID
	JOIN louislocaldatabase.Airports a2 ON r.DestinationID = a2.AirportID
    JOIN louislocaldatabase.Countries c ON c.Name = a1.Country
WHERE r.Stops = "0" AND a2.City = "Chicago")
ORDER BY City
LIMIT 15;

---------------
