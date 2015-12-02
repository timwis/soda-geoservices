# SODA GeoServices
Query [Esri Geoservices](http://geoservices.github.io/) using a [SODA2](https://dev.socrata.com/docs/queries/)-style API

This is still a work in progress. Check out the supported items below to get an idea for the functionality.

## Why?
Geoservices are incredibly powerful but have a complex query structure as a result, and
can be intimidating for new users - particularly when you want to do a basic query
like a [group by](http://geoservices.github.io/query.html#aggregation-statistics).
This tool provides a layer of abstraction - an easy-to-use API for common queries.
It is not meant to cover the breadth of functionality geoservices provide; rather just
those provided by the SODA2 spec. 

## Usage
1. Clone this repo and install dependencies via `npm install`
2. Run the tests via `npm run --silent test`

## References
* [GeoServices Documentation](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Query_Map_Service_Layer/02r3000000p1000000/)
* [SODA2 Documentation](https://dev.socrata.com/docs/queries/)

## Supported
The following features have been implemented as [tests](test/soda-geoservices.js)
### select
* [x] multiple fields
* [ ] field aliases
* [ ] operators

### where
* [x] simple filters
* [x] boolean operators
* [ ] order of operations

### group
* [x] group by
* [x] aggregation
* [x] aggregation w/uppercase function name
* [x] aggregation w/wildcard
* [x] aggregation w/aliases

### other
* [x] order w/direction
* [x] limit
* [x] offset
* [ ] full-text search

### select functions
* [x] extent
* [x] extent w/count
* [ ] convex hull
* [ ] date format
* [ ] upper/lower
* [ ] case

### where functions
* [x] between
* [ ] not between
* [ ] in
* [ ] not in
* [ ] starts with
* [ ] date format
* [x] within_box
* [x] within_circle
* [ ] within_polygon