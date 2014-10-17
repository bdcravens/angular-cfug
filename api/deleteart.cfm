<cfquery name="deleteArt" datasource="cfartgallery">
  delete from art
  where artid=#id#
</cfquery>
