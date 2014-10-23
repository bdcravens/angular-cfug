# Angular/ColdFusion demo
Following APIs talk to the `cfartgallery` database installed with ColdFusion 11.

### REST: (assuming cfugrest is the name configured in CF Admin)

Can pass Accept header of application/json or application/xml to
vary returned data type

* `GET /rest/cfugrest/artService/` - array of structs
* `GET /rest/cfugrest/artService/1` - struct representing single art piece
* `POST /rest/cfugrest/artService/` - returns id of new art piece
form fields: artname (string), description (string), price (numeric)
* `PUT /rest/cfugrest/artService/1` form fields: artname (string), description (string), price (numeric)
* `DELETE /rest/cfugrest/artService/1`

### non-REST API - corresponds to REST API above
Simple HTTP output of JSON
* `api/listart.cfm`
* `api/getart.cfm?id=1`
* `api/addart.cfm` (same form fields as POST)
* `api/updateart.cfm?id=1` (same form fields as PUT)
* `api/deleteart.cfm?id=1`

# Angular

### Setup
From the `angular` directory, run the following command to install all of the dependencies.
```
$ bower install
```