<cfcomponent rest="true" restpath="artService">

    <cffunction name="artList" access="remote" returntype="array" httpmethod="GET">
        <cfquery name="art_pieces" datasource="cfartgallery">
        select artid, artname, description, price from art
        </cfquery>
        <cfset art_array = []>
        <cfloop query="art_pieces">
          <cfset arrayAppend(art_array, {id: artid, artname: artname, description: description, price: price})>
        </cfloop>
        <cfreturn art_array>
    </cffunction>

    <cffunction name="getArt" access="remote" returntype="struct" httpmethod="GET" restpath="{id}">
      <cfargument name="id" type="string" required="yes" restargsource="path">

      <cfquery name="art_piece" datasource="cfartgallery">
      select artid, artname, description, price from art where artid=#id#
      </cfquery>

      <cfif art_piece.recordCount eq 0>
        <cfthrow type="RestError" errorcode="404">
      </cfif>
      <cfreturn {id: art_piece.artid, artname: art_piece.artname, description: art_piece.description, price: art_piece.price}>

    </cffunction>

    <cffunction name="addArt" access="remote" returntype="string" httpmethod="POST">
      <cfargument name="artname" type="string" required="yes" restargsource="form">
      <cfargument name="description" type="string" required="yes" restargsource="form">
      <cfargument name="price" type="numeric" required="yes" restargsource="form">

      <cfquery name="saveArt" datasource="cfartgallery" result="result">
        insert into art (artname, description, price)
        values ('#artname#', '#description#', #price#)
      </cfquery>

      <cfreturn result.generatedKey>

    </cffunction>

    <cffunction name="updateArt" access="remote" returntype="void" httpmethod="PUT" restpath="{id}">
      <cfargument name="id" type="string" required="yes" restargsource="path">
      <cfargument name="artname" type="string" required="no" restargsource="form">
      <cfargument name="description" type="string" required="no" restargsource="form">
      <cfargument name="price" type="numeric" required="no" restargsource="form">
      <cfquery name="updateArt" datasource="cfartgallery">
        update art
        set
          <cfif isdefined('artname')>artname='#artname#',</cfif>
          <cfif isdefined('description')>description='#description#',</cfif>
          <cfif isdefined('price')>price=#price#</cfif>
        where artid=#id#
      </cfquery>
    </cffunction>


    <cffunction name="deleteArt" access="remote" returntype="void" httpmethod="DELETE" restpath="{id}">
      <cfargument name="id" type="string" required="yes" restargsource="path">
      <cfquery name="deleteArt" datasource="cfartgallery">
        delete from art
        where artid=#id#
      </cfquery>
    </cffunction>

</cfcomponent>
