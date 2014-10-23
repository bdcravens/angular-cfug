<cfheader name="Access-Control-Allow-Origin" value="*">

<cfquery name="art_pieces" datasource="cfartgallery">
select artid, artname, description, price from art
</cfquery>

<cfset art_array = []>
<cfloop query="art_pieces">
  <cfset arrayAppend(art_array, {id: artid, artname: artname, description: description, price: price})>
</cfloop>

<cfoutput>#serializeJson(art_array)#</cfoutput>
