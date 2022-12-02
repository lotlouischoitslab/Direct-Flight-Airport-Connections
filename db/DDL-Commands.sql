CREATE TABLE Login (
  Username VARCHAR(256) NOT NULL,
  Password VARCHAR(256) NOT NULL,
  PRIMARY KEY (Username));
  
CREATE TABLE Search_History (
  SearchID int NOT NULL,
  Username varchar(256) NOT NULL,
  RouteID int NOT NULL,
  Airline varchar(256) DEFAULT NULL,
  AirlineID varchar(256) DEFAULT NULL,
  Source varchar(256) DEFAULT NULL,
  SourceID varchar(256) DEFAULT NULL,
  Destination varchar(256) DEFAULT NULL,
  DestinationID varchar(256) DEFAULT NULL,
  Codeshare varchar(256) DEFAULT NULL,
  Stops varchar(256) DEFAULT NULL,
  PRIMARY KEY (SearchID)
);

CREATE TABLE Airlines (
  AirlineID varchar(256) NOT NULL,
  Name varchar(256) DEFAULT NULL,
  IATA varchar(256) DEFAULT NULL,
  ICAO varchar(256) DEFAULT NULL,
  Country varchar(256) DEFAULT NULL,
  Active varchar(1) DEFAULT NULL,
  PRIMARY KEY (AirlineID)
);

CREATE TABLE Airports (
  AirportID varchar(256) NOT NULL,
  Name varchar(256) DEFAULT NULL,
  City varchar(256) DEFAULT NULL,
  Country varchar(256) DEFAULT NULL,
  IATA varchar(3) DEFAULT NULL,
  ICAO varchar(4) DEFAULT NULL,
  TimeZone varchar(256) DEFAULT NULL,
  DST varchar(10) DEFAULT NULL,
  TZ varchar(256) DEFAULT NULL,
  PRIMARY KEY (AirportID)
);

CREATE TABLE Countries (
  Name varchar(256) NOT NULL,
  ISO varchar(45) DEFAULT NULL,
  PRIMARY KEY (Name)
);

CREATE TABLE Planes (
  Name varchar(256) NOT NULL,
  IATA varchar(45) DEFAULT NULL,
  ICAO varchar(45) DEFAULT NULL,
  PRIMARY KEY (Name)
);

CREATE TABLE Routes (
  RouteID int NOT NULL,
  Airline varchar(256) DEFAULT NULL,
  AirlineID varchar(256) DEFAULT NULL,
  Source varchar(256) DEFAULT NULL,
  SourceID varchar(256) DEFAULT NULL,
  Destination varchar(256) DEFAULT NULL,
  DestinationID varchar(256) DEFAULT NULL,
  Codeshare varchar(256) DEFAULT NULL,
  Stops varchar(256) DEFAULT NULL,
  PRIMARY KEY (RouteID)
);
