<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/project">
<html>

 <head>
   <title>Docubricks Doc</title>
   <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"/>
   <link href="terrier/font-awesome/css/font-awesome.min.css" rel="stylesheet"/>
    <link href="terrier/dist/terrierX.css" rel="stylesheet"/>
   <script src="stylesheets/jquery-1.11.3.min.js"></script>
   <script type="text/javascript" src="stylesheets/CollapsibleLists.js"></script>
 </head>

<body>
 <nav id="menu">
     <h1 class="center">Boo!</h1>
 </nav>

 <main id="panel">

     <header id="top-bar" class="barx" style="background: #725DA7;">
         <div class="container">
         <div class="row">
          <div class="col1 colExample">
            <a class="name" href="#"><xsl:value-of select="project_name"/>.</a>
          </div>
          <div  class="col10 colExample">
           <nav id="cola">
            <xsl:for-each select="physical_part">
              <xsl:variable name="pVar" select="description"/>
              <a href="#" class="button" style="text-align: right;
               font-size: .35rem;
               font-weight: 400;
               line-height: 34px;
               letter-spacing= .1rem;
               padding: 0 9px;"
                >Brick</a>
            </xsl:for-each>
           </nav>
          </div>
            <div class="col1 colExample">
              <a class="name" href="#">BOM</a>
            </div>
         </div>
         </div>




     </header>
 </main>

/*****************************************************************************/
<script type="text/javascript">
function bricklists(){
 <xsl:for-each select="physical_part">
  <xsl:variable name="pVar" select="description"/>
  <li>
   <xsl:attribute name="id">
     <xsl:value-of select="$pVar"/>
    </xsl:attribute>
    <xsl:attribute name="onclick">
    reply_clickc(this.id)
   </xsl:attribute>
   <a><span><xsl:value-of select="description"/></span></a>
  </li>
</xsl:for-each>
}
bricklists();
 </script>
/*****************************************************************************/
</body>
/*****************************************************************************/
</html>
</xsl:template>
</xsl:stylesheet>
