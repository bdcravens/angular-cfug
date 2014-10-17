<cfquery name="art_piece" datasource="cfartgallery">
select artid, artname, description, price from art
where artid=#id#
</cfquery>

<cfif art_piece.recordCount eq 0>
  <cfheader statusCode="404"><cfabort>
</cfif>
<cfset result = {id: art_piece.artid,
    artname: art_piece.artname,
    description: art_piece.description,
    price: art_piece.price}>

<cfoutput>#serializeJson(result)#</cfoutput>
