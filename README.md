# SODA GeoServices
Query [Esri Geoservices](http://geoservices.github.io/) using a [SODA2](https://dev.socrata.com/docs/queries/)-style API

This is still a work in progress. Check out the [list of features](https://github.com/timwis/soda-geoservices/issues/1) and 
[tests](test/soda-geoservices.js) to get an idea for the functionality.

## Why?
Geoservices are incredibly powerful but have a complex query structure as a result, and
can be intimidating for new users - particularly when you want to do a basic query
like a [group by](http://geoservices.github.io/query.html#aggregation-statistics).
This tool provides a layer of abstraction - an easy-to-use API for common queries.
It is not meant to cover the breadth of functionality geoservices provide; rather just
those provided by the SODA2 spec. 

## Usage
1. Clone this repo and install dependencies via `npm install`
2. Run the tests via `npm test`

## References
* [GeoServices Documentation](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Query_Map_Service_Layer/02r3000000p1000000/)
* [SODA2 Documentation](https://dev.socrata.com/docs/queries/)
* [Supported functions for ArcGIS Server](http://resources.arcgis.com/en/help/main/10.2/index.html#//015400000686000000) (v10.2)
* [Validate SQL](https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/APPEALS_LIRB/FeatureServer/0/validateSQL)