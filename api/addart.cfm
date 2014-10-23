<cfheader name="Access-Control-Allow-Origin" value="*">

<cfquery name="saveArt" datasource="cfartgallery"
  result="result">
  insert into art (artname, description, price)
  values ('#artname#', '#description#', #price#)
</cfquery>

<cfoutput>#result.generatedKey#</cfoutput>
