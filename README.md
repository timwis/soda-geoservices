# SODA GeoServices
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

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

## Examples
Using `https://services.arcgis.com/fLeGjb7u4uXqeF9q/ArcGIS/rest/services`

* [/Storefront_Improvement_Programs/FeatureServer/0](http://soda-geoservices.herokuapp.com/Storefront_Improvement_Programs/FeatureServer/0)
* [/Storefront_Improvement_Programs/FeatureServer/0?relations=Mayfair CDC](http://soda-geoservices.herokuapp.com/Storefront_Improvement_Programs/FeatureServer/0?relations=Mayfair CDC)
* [/Storefront_Improvement_Programs/FeatureServer/0?$select=funded_by, count(*)&$group=funded_by](http://soda-geoservices.herokuapp.com/Storefront_Improvement_Programs/FeatureServer/0?$select=funded_by, count(*)&$group=funded_by)
* [/Storefront_Improvement_Programs/FeatureServer/0?$select=extent(geometry)](http://soda-geoservices.herokuapp.com/Storefront_Improvement_Programs/FeatureServer/0?$select=extent(geometry))
* [/Storefront_Improvement_Programs/FeatureServer/0?$where=within_circle(geometry, 39.9520, -75.1646, 100)](http://soda-geoservices.herokuapp.com/Storefront_Improvement_Programs/FeatureServer/0?$where=within_circle(geometry, 39.9520, -75.1646, 100))
* [/Storefront_Improvement_Programs/FeatureServer/0?$where=within_box(geometry, 39.9537, -75.1577, 39.9623, -75.1422)](http://soda-geoservices.herokuapp.com/Storefront_Improvement_Programs/FeatureServer/0?$where=within_box(geometry, 39.9537, -75.1577, 39.9623, -75.1422))

## Usage
1. Clone this repo and install dependencies via `npm install`
2. Copy `.env.sample` to `.env` and fill in `PROXY_TO` with the path to your Geoservices (ex. `http://maps2.dcgis.dc.gov/dcgis/rest/services/`)
and any default parameters in `DEFAULT_PARAMS` in `a=b&c=d` format
3. Run the server via `npm run server`
4. Append the service to your URL and use SODA2 querystring parameters

For example:
```
http://localhost:8080/DDOT/AlleyConditions/MapServer/0?alley_material=Asphalt
```

## Development
* Write tests first and run them via `npm test`
* Lint the code style via `npm run lint` (uses [standard](http://standardjs.com))

## References
* [GeoServices Documentation](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Query_Map_Service_Layer/02r3000000p1000000/)
* [SODA2 Documentation](https://dev.socrata.com/docs/queries/)
* [Supported functions for ArcGIS Server](http://resources.arcgis.com/en/help/main/10.2/index.html#//015400000686000000) (v10.2)
* [Validate SQL](https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/APPEALS_LIRB/FeatureServer/0/validateSQL)