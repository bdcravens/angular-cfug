<cfheader name="Access-Control-Allow-Origin" value="*">

<cfquery name="deleteArt" datasource="cfartgallery">
  delete from art
  where artid=#id#
</cfquery>
