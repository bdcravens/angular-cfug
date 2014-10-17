<cfquery name="updateArt" datasource="cfartgallery">
  update art
  set
    <cfif isdefined('artname')>artname='#artname#',</cfif>
    <cfif isdefined('description')>description='#description#',</cfif>
    <cfif isdefined('price')>price=#price#</cfif>
  where artid=#id#
</cfquery>
