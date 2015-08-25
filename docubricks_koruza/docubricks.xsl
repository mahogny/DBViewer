<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/project">
<html>

  <head>
    <title>Docubricks Doc</title>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <link rel="stylesheet" type="text/css" href="stylesheets/normalize.css" media="screen"/>
    <link href='http://fonts.googleapis.com/css?family=Open+Sans:400,700' rel='stylesheet' type='text/css'/>
    <link rel="stylesheet" type="text/css" href="stylesheets/stylesheet.css" media="screen"/>
    <link rel="stylesheet" type="text/css" href="stylesheets/github-light.css" media="screen"/>
    <script src="stylesheets/jquery-1.11.3.min.js"></script>
    <script type="text/javascript" src="stylesheets/CollapsibleLists.js"></script>
  </head>



<body onload="display_tree()">

  <section class="page-header">
    <h1 class="project-name">
      <xsl:value-of select="project_name"/>
    </h1>
    <h2 class="project-tagline">Project Documentation</h2>
    <a href="../" target="blank" class="btn">View Files</a>
  </section>

  <section class="main-content">

  <xsl:variable name="vTparts" select="physical_part/description"/>
  <xsl:variable name="vTunit" select="unit/name"/>
  <xsl:variable name="vTauthor" select="author/name"/>

  <div id='cssmenu'>
<!-- %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% -->
<ul>
<li class='active has-sub' onclick="display_tree()"><a><span>Project Tree A</span></a></li>
<!-- %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% -->
<li class='active has-sub' onclick="display_treeB()"><a><span>Project Tree B</span></a></li>
<!-- %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% -->
      <!-- li class='active has-sub'><a href='#'><span>Parts</span></a>
            <ul>
            <xsl:for-each select="physical_part">
            <xsl:variable name="pVar" select="description"/>
            <li>
              <xsl:attribute name="id">
                <xsl:value-of select="$pVar"/>
              </xsl:attribute>
              <xsl:attribute name="onclick">
                reply_clickc(this.id)
              </xsl:attribute>
              <a href='#'><span><xsl:value-of select="description"/></span></a>
            </li>
            </xsl:for-each>
            </ul>
    </li -->
<!-- %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% -->

    <!-- li class='active has-sub'><a href='#'><span>Units</span></a>
      <ul>
        <xsl:for-each select="unit">
        <xsl:variable name="uVar" select="name"/>
        <li>
          <xsl:attribute name="id">
            <xsl:value-of select="$uVar"/>
          </xsl:attribute>
          <xsl:attribute name="onclick">
            reply_clickb(this.id)
          </xsl:attribute>
          <a href='#'><span><xsl:value-of select="$uVar"/></span></a>
        </li>
        </xsl:for-each>
      </ul>
    </li -->
<!-- %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% -->
    <!-- li class='active has-sub'><a href='#'><span>Assembly Instructions</span></a>
      <ul>
        <xsl:for-each select="unit">
          <xsl:variable name="aiVar" select="name"/>
          <li>
            <xsl:attribute name="id">
              <xsl:value-of select="$aiVar"/>
            </xsl:attribute>
            <xsl:attribute name="onclick">
              reply_clickd(this.id)
            </xsl:attribute>
            <a href='#'><span><xsl:value-of select="$aiVar"/></span></a>
          </li>
          </xsl:for-each>
        </ul>
    </li -->
<!-- %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% -->
    <!-- li class='active has-sub'><a href='#'><span>Authors</span></a>
      <ul>
        <xsl:for-each select="author">
            <xsl:variable name="myVar" select="name"/>
            <li>
              <xsl:attribute name="id">
                <xsl:value-of select="$myVar" />
              </xsl:attribute>
              <xsl:attribute name="onclick">
                reply_click(this.id)
              </xsl:attribute>

              <a href='#'><span><xsl:value-of select="$myVar"/></span></a>
            </li>
        </xsl:for-each>
      </ul>
    </li -->

    </ul>
  </div>

<!-- %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% -->
    <!-- get unit[1] id to put as default -->
    <div class="info-cont" id="tree" align="left">
      <h1 id="dheadx" align="left"><span></span></h1>
      <p id="dpx" align= "left"><span></span></p>
    </div>
<!-- %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% -->
 <div id='cssmenu'>
  <ul>
   <li class='active has-sub'><a href='#'><span>Bricks</span></a>
         <ul>
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
         </ul>
 </li>

 <!-- %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% -->
 <li class='active has-sub'><a href='#'><span>Assembly Instructions</span></a>
   <ul>
     <xsl:for-each select="unit">
       <xsl:variable name="aiVar" select="name"/>
       <li>
         <xsl:attribute name="id">
           <xsl:value-of select="$aiVar"/>
         </xsl:attribute>
         <xsl:attribute name="onclick">
           reply_clickd(this.id)
         </xsl:attribute>
         <a><span><xsl:value-of select="$aiVar"/></span></a>
       </li>
       </xsl:for-each>
     </ul>
 </li>
<!-- %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% -->
<li class='active has-sub'><a href='#'><span>Authors</span></a>
  <ul>
    <xsl:for-each select="author">
        <xsl:variable name="myVar" select="name"/>
        <li>
          <xsl:attribute name="id">
            <xsl:value-of select="$myVar" />
          </xsl:attribute>
          <xsl:attribute name="onclick">
            reply_click(this.id)
          </xsl:attribute>

          <a href='#'><span><xsl:value-of select="$myVar"/></span></a>
        </li>
    </xsl:for-each>
  </ul>
</li>
<!-- %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% -->
  </ul>
 </div>
<!-- %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% -->
  <!-- get unit[1] id to put as default -->
  <div class="info-cont" id="display-info" align="left">

    <h1 id="dhead" align="left"><span></span></h1>
    <p id="dp" align= "left"><span></span></p>

  </div>


<!-- %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% -->


        <footer class="site-footer">
          <span class="site-footer-owner"><a href="https://github.com/DIYbiospace/Docubricks">Docubricks</a> is maintained by <a href="https://github.com/DIYbiospace">DIYbiospace</a>.</span>

          <span class="site-footer-credits">This page uses the <a href="https://github.com/jasonlong/cayman-theme">Cayman theme</a> by <a href="https://twitter.com/jasonlong">Jason Long</a>.</span>
        </footer>

    </section>






    <!-- xsl:for-each select="physical_part">
      <h1>Physical Part. </h1>
      <p>Description: <xsl:value-of select="description"/><br />
      Supplier: <xsl:value-of select="supplier" /><br />
      Supplier's part number: <xsl:value-of select="supplier_part_num" /><br />
      Manufacturer's part number: <xsl:value-of select="manufacturer_part_num" /><br />
      URL: <xsl:value-of select="url" /><br />
      Amount: <xsl:value-of select="material_amount" /><br />
      Material Unit: <xsl:value-of select="material_unit" /><br />
      Media: <xsl:value-of select="media" /><br />
      </p>
    </xsl:for-each -->

    <!-- xsl:for-each select="unit">
    <h1>Unit. </h1>
    <p>Name: <xsl:value-of select="name"/><br/>
    Abstract:  <xsl:value-of select="abstract"/><br/>
    Long Description:  <xsl:value-of select="long_description"/><br/>
    What:  <xsl:value-of select="what"/><br/>
    Why:  <xsl:value-of select="why" /><br/>
    How:  <xsl:value-of select="how" /><br/>
    License:  <xsl:value-of select="license" /><br/>
    File:  <xsl:value-of select="media/file/@url" /><br/>
    <img>
    		<xsl:attribute name="width">
    			100
    		</xsl:attribute>
    		<xsl:attribute name="height">
    			100
    		</xsl:attribute>
    		<xsl:attribute name="class">
    			CalloutRightPhoto
    		</xsl:attribute>
    		<xsl:attribute name="src">
          <xsl:value-of select="media/file/@url" />
        </xsl:attribute>
    	</img>
    </p>
    <h2>Assembly Instructions:</h2>
      <xsl:for-each select="assembly_instruction/step">
      <p>
        <strong>Step:</strong>
        <xsl:value-of select="description" /><br/>
        <img>
            <xsl:attribute name="width">
              100
            </xsl:attribute>
            <xsl:attribute name="height">
              100
            </xsl:attribute>
            <xsl:attribute name="class">
              CalloutRightPhoto
            </xsl:attribute>
            <xsl:attribute name="src">
              <xsl:value-of select="media/file/@url" />
            </xsl:attribute>
          </img>
      </p>
      </xsl:for-each>

      <xsl:for-each select="logical_part">
        <p>
          <strong>Logical Part</strong><br/>
          Description: <xsl:value-of select="description"/><br/>
          Desginator: <xsl:value-of select="designator"/><br/>
          Quantity: <xsl:value-of select="quantity"/><br/>
          Implementation type: <xsl:value-of select="implementation/@type"/><br/>
          Media: <xsl:value-of select="media"/>
        </p>
      </xsl:for-each>

  </xsl:for-each -->

  <!-- xsl:for-each select="author">
      <h1>Author. </h1>
      <p>Name: <xsl:value-of select="name"/><br />
      e-mail: <xsl:value-of select="email" /><br />
      Orcid: <xsl:value-of select="orcid" /><br />
      Affiliation: <xsl:value-of select="affiliation"/><br />
      </p>
  </xsl:for-each -->


<!-- *********************************************************************** -->
<script type="text/javascript">
 function display_tree(){
 var qnx;
 var qmx;
 qnx=document.getElementById("dheadx");
 qnx.innerHTML="Project Tree.";
 qmx=document.getElementById("dpx");
 qmx.innerHTML="This is a beautiful tree ";
 qmx.appendChild(document.createElement("br"));
 qmx.innerHTML+="Parts ";
 var parts=[];
 var n=0;
//////PARTS

 <xsl:for-each select="physical_part">
   var part=new Object();
   <xsl:variable name="ptname" select='description'/>
   part.description='<xsl:value-of select="$ptname"/>';

   <xsl:variable name="nxb" select="supplier"/>
   part.supplier='<xsl:value-of select="$nxb"/>';

   <xsl:variable name="nxc" select="supplier_part_num"/>
   part.supplier_part_num='<xsl:value-of select="$nxc" />';

   <xsl:variable name="nxd" select="manufacturer_part_num" />
   part.manufacturer_part_num='<xsl:value-of select="$nxd" />';

   <xsl:variable name="nxe" select="url" />
   part.url='<xsl:value-of select="$nxe" />';

   <xsl:variable name="nxf" select="material_amount" />
   part.material_amount='<xsl:value-of select="$nxf" />';

   <xsl:variable name="nxg" select="material_unit" />
   part.material_unit='<xsl:value-of select="$nxg" />';

   <xsl:variable name="nxh" select="media" />
   part.media='<xsl:value-of select="$nxh" />';

   parts[n]=part;
   n++;
  </xsl:for-each>

  console.log("caca");
  console.log(parts.length);
  console.log(parts);

<![CDATA[
var ul= document.createElement("ul");
ul.setAttribute("id","parts");
ul.setAttribute("class","collapsibleList");

for(i=0;i<parts.length;i++){
 li=document.createElement("li");
 li.appendChild(document.createTextNode(parts[i].description));
 li.setAttribute("id",parts[i].description);

  var ulx=document.createElement("ul");
   var lix= document.createElement("li");
   lix.appendChild(document.createTextNode("supplier: "+parts[i].supplier));
   //lix.appendChild(document.createTextNode("supplier: "));
   ulx.appendChild(lix);

   var lix= document.createElement("li");
   lix.appendChild(document.createTextNode("supplier part number: "+parts[i].supplier_part_num));
   ulx.appendChild(lix);

   var lix= document.createElement("li");
   lix.appendChild(document.createTextNode("manufacturer part number: "+parts[i].manufacturer_part_num));
   ulx.appendChild(lix);

   var lix= document.createElement("li");
   lix.appendChild(document.createTextNode("url: "+parts[i].url));
   ulx.appendChild(lix);

   var lix= document.createElement("li");
   lix.appendChild(document.createTextNode("material amount: "+parts[i].material_amount));
   ulx.appendChild(lix);

   var lix= document.createElement("li");
   lix.appendChild(document.createTextNode("material unit: "+parts[i].material_unit));
   ulx.appendChild(lix);

   var lix= document.createElement("li");
   lix.appendChild(document.createTextNode("media: "+parts[i].media));
   ulx.appendChild(lix)

 li.appendChild(ulx);
 ul.appendChild(li);
}
qmx.appendChild(ul);

CollapsibleLists.applyTo(document.getElementById("parts"));

]]>

}

 display_tree();
</script>
<!-- *********************************************************************** -->
<script type="text/javascript">
 function display_treeB(){
 var qnx;
 var qmx;
 qnx=document.getElementById("dheadx");
 qnx.innerHTML="Project Tree B";
 qmx=document.getElementById("dpx");
 qmx.innerHTML="This is a beautiful tree ";
 qmx.appendChild(document.createElement("br"));
 qmx.innerHTML+="Parts ";
 var units=[];
 var n=0;


 <xsl:for-each select="unit">
  var unit= new Object();

  <xsl:variable name="nxa" select="name"/>
  unit.name= '<xsl:value-of select="$nxa"/>';

  <xsl:variable name="nxb" select="abstract"/>
  unit.abstract='<xsl:value-of select="$nxb"/>';

  <xsl:variable name="nxc" select="long_description"/>
  unit.long_description='<xsl:value-of select="$nxc"/>';

  <xsl:variable name="nxd" select="what" />
  unit.what='<xsl:value-of select="$nxd"/>';

  <xsl:variable name="nxe" select="why"/>
  unit.why='<xsl:value-of select="$nxe"/>';

  <xsl:variable name="nxf" select="how"/>
  unit.how='<xsl:value-of select="$nxf"/>';

  <xsl:variable name="nxg" select="license" />
  unit.license='<xsl:value-of select="$nxe"/>';

  <xsl:variable name="nxh" select="media"/>
  unit.media='<xsl:value-of select="$nxf"/>';

  var z1=[];
  var z2=[];
  var k=0;
  <xsl:for-each select="assembly_instruction/step">
    <xsl:variable name="ax1" select="description"/>
    z1[k]="STEP!"; <!-- '<xsl:value-of select="ax1"/>';-->
    <xsl:variable name="ax2" select="media/file/@url"/>
    z2[k]='<xsl:value-of select="$ax2"/>';
    k++;
  </xsl:for-each>
  unit.aidesc=z1;
  unit.aipics=z2;
  units[n]=unit;
  n++;
 </xsl:for-each>
 console.log("Caca")
 console.log(units.length);
 console.log(units);


<![CDATA[
qmx.innerHTML="Bricks ";
var ul2=document.createElement("ul");
ul2.setAttribute("id","bricks");
ul2.setAttribute("class","collapsibleList");

for(j=0;j<units.length;j++){
     li=document.createElement("li");
     li.appendChild(document.createTextNode(units[j].name));
     li.setAttribute("id",units[j].name);

      var ulj=document.createElement("ul");

      var lzj= document.createElement("li");
      lzj.appendChild(document.createTextNode("abstract: "+units[j].abstract));
      ulj.appendChild(lzj);

      var lzj= document.createElement("li");
      lzj.appendChild(document.createTextNode("detailed description: "+units[j].long_description));
      ulj.appendChild(lzj);

      var lzj= document.createElement("li");
      lzj.appendChild(document.createTextNode("what: "+units[j].what));
      ulj.appendChild(lzj);

      var lzj= document.createElement("li");
      lzj.appendChild(document.createTextNode("why: "+units[j].why));
      ulj.appendChild(lzj);

      var lzj= document.createElement("li");
      lzj.appendChild(document.createTextNode("how: "+units[j].how));
      ulj.appendChild(lzj);


      var lzj= document.createElement("li");
      lzj.appendChild(document.createTextNode("license: "+units[j].license));
      ulj.appendChild(lzj);


      var lzj= document.createElement("li");
      lzj.appendChild(document.createTextNode("media: "+units[j].license));
      ulj.appendChild(lzj);

      var lzjai= document.createElement("li");
      lzjai.appendChild(document.createTextNode("Assembly Instructions: "));
      var mux=units[j].aidesc.length;
      if(mux>0){
       console.log("rata");
       console.log(mux);
       var ailist= document.createElement("ul");
       var aij;
       for(aij=0;aij<mux;aij++){
         var laij=document.createElement("li");
         laij.appendChild(document.createTextNode("Step "+(1+aij).toString()+"." ));
         ailist.appendChild(laij);
        }
        lzjai.appendChild(ailist);
       }

      ulj.appendChild(lzjai);


     li.appendChild(ulj);
     ul2.appendChild(li);
     }
qmx.appendChild(ul2);

CollapsibleLists.applyTo(document.getElementById("bricks"));
]]>

}
 display_treeB();
</script>
<!-- *********************************************************************** -->
  <script type="text/javascript">
    function reply_click(clicked_id)
    {
      var x=clicked_id;
      console.log(x);
      //document.getElementById("display-info").innerHTML=x;

      <xsl:variable name="nid" select='clicked_id'/>
      console.log('<xsl:value-of select="$nid"/>');
      <xsl:for-each select="author">
        console.log("caca");
        <xsl:variable name="nida" select="name"/>
        console.log('<xsl:value-of select="$nida"/>');
        var y= '<xsl:value-of select="$nida"/>';

        <xsl:variable name="nidb" select="email"/>
        console.log('<xsl:value-of select="$nidb"/>');
        var x1= '<xsl:value-of select="$nidb"/>';

        <xsl:variable name="nidc" select="orcid"/>
        console.log('<xsl:value-of select="$nidc"/>');
        var x2= '<xsl:value-of select="$nidc"/>';

        <xsl:variable name="nidd" select="affiliation"/>
        console.log('<xsl:value-of select="$nidd"/>');
        var x3= '<xsl:value-of select="$nidd"/>';

        console.log(y);
        var n = x.localeCompare(y);
        if (n==0){
        console.log('wooopwop');
        qnx=document.getElementById("dhead");
        qnx.innerHTML="Author.";
        qmx=document.getElementById("dp");


        qmx.innerHTML="Name: ";
        qmx.innerHTML+=x;
        qmx.appendChild(document.createElement("br"));

        qmx.innerHTML+="email: ";
        qmx.innerHTML+=x1;
        qmx.appendChild(document.createElement("br"));

        qmx.innerHTML+="orcid: ";
        qmx.innerHTML+=x2;
        qmx.appendChild(document.createElement("br"));

        qmx.innerHTML+="affiliation: ";
        qmx.innerHTML+=x3;

        }
      </xsl:for-each>
    }
  </script>

  <script type="text/javascript">
    function reply_clickb(clicked_id)
    {
      var xu=clicked_id;
      //alert(clicked_id);
      <xsl:variable name="nidu" select='clicked_id'/>
      <xsl:for-each select="unit">
        <xsl:variable name="nxa" select="name"/>
        var y= '<xsl:value-of select="$nxa"/>';

        <xsl:variable name="nxb" select="abstract"/>
        var xu1='<xsl:value-of select="$nxb"/>';

        <xsl:variable name="nxc" select="license"/>
        var xu2='<xsl:value-of select="$nxc" />';

        <xsl:variable name="nxd" select="media/file/@url" />
        var xu3='<xsl:value-of select="$nxd" />'

        var n = xu.localeCompare(y);
        if (n==0){

          qnx=document.getElementById("dhead");
          qnx.innerHTML="Unit.";
          qmx=document.getElementById("dp");

          qmx.innerHTML="Name: ";
          qmx.innerHTML+=xu;
          qmx.appendChild(document.createElement("br"));

          qmx.innerHTML+="Abstract: ";
          qmx.innerHTML+=xu1;
          qmx.appendChild(document.createElement("br"));

          qmx.innerHTML+="License: ";
          qmx.innerHTML+=xu2;
          qmx.appendChild(document.createElement("br"));

          qmx.innerHTML+="File: ";
          qmx.innerHTML+=xu3;
          qmx.appendChild(document.createElement("br"));


          var pic = document.createElement("IMG");
          pic.setAttribute("src", xu3);
          pic.setAttribute("width", "100");
          pic.setAttribute("height", "100");
          pic.setAttribute("alt", "The Pulpit Rock");
          qmx.appendChild(pic);

        }
      </xsl:for-each>
    }
  </script>

  <script type="text/javascript">
    function reply_clickc(clicked_id)
    {
      var xu=clicked_id;
      <xsl:variable name="nidu" select='clicked_id'/>
      <xsl:for-each select="physical_part">
        <xsl:variable name="nxa" select="description"/>
        var y= '<xsl:value-of select="$nxa"/>';

        <xsl:variable name="nxb" select="supplier"/>
        var xu1='<xsl:value-of select="$nxb"/>';

        <xsl:variable name="nxc" select="supplier_part_num"/>
        var xu2='<xsl:value-of select="$nxc" />';

        <xsl:variable name="nxd" select="manufacturer_part_num" />
        var xu3='<xsl:value-of select="$nxd" />'

        <xsl:variable name="nxe" select="url" />
        var xu4='<xsl:value-of select="$nxe" />'

        <xsl:variable name="nxf" select="material_amount" />
        var xu5='<xsl:value-of select="$nxf" />'

        <xsl:variable name="nxg" select="material_unit" />
        var xu6='<xsl:value-of select="$nxg" />'

        <xsl:variable name="nxh" select="media" />
        var xu7='<xsl:value-of select="$nxh" />'

        var n = xu.localeCompare(y);
        if (n==0){

          qnx=document.getElementById("dhead");
          qnx.innerHTML="Physical Part.";
          qmx=document.getElementById("dp");

          qmx.innerHTML="Description: ";
          qmx.innerHTML+=xu;
          qmx.appendChild(document.createElement("br"));

          qmx.innerHTML+="Supplier: ";
          qmx.innerHTML+=xu1;
          qmx.appendChild(document.createElement("br"));

          qmx.innerHTML+="Supplier Part Number: ";
          qmx.innerHTML+=xu2;
          qmx.appendChild(document.createElement("br"));

          qmx.innerHTML+="Manufacturer Part Number: ";
          qmx.innerHTML+=xu3;
          qmx.appendChild(document.createElement("br"));

          qmx.innerHTML+="URL: ";
          qmx.innerHTML+=xu4;
          qmx.appendChild(document.createElement("br"));

          qmx.innerHTML+="Material Amount: ";
          qmx.innerHTML+=xu5;
          qmx.appendChild(document.createElement("br"));

          qmx.innerHTML+="Material Unit: ";
          qmx.innerHTML+=xu6;
          qmx.appendChild(document.createElement("br"));

          qmx.innerHTML+="Media: ";
          qmx.innerHTML+=xu7;
          qmx.appendChild(document.createElement("br"));
          }
        </xsl:for-each>
    }
  </script>

  <script type="text/javascript">
    function reply_clickd(clicked_id)
    {
      var xu=clicked_id;
      //alert(clicked_id);
      qnx=document.getElementById("dhead");
      qnx.innerHTML="Assembly Instructions.";
      qmx=document.getElementById("dp");
      qmx.innerHTML="";

      <xsl:for-each select="unit">
        <xsl:variable name="nxa" select="name"/>
        var z1=[];
        var z2=[];
        var k=0;
        var y= '<xsl:value-of select="$nxa"/>';

        var n = xu.localeCompare(y);

        if (n==0){
        <xsl:for-each select="assembly_instruction/step">
          <xsl:variable name="axa" select="description"/>
          var sx='<xsl:value-of select="$axa"/>';
          z1[k]="getting there";

          <xsl:variable name="ax2" select="media/file/@url"/>

          console.log(z1[k]);
          console.log(k);
          z2[k]='<xsl:value-of select="$ax2"/>';
          k++;
        </xsl:for-each>
        }

        <![CDATA[
         var n = xu.localeCompare(y);
         if (n==0){
          if (z2.length==0){
           qnx=document.getElementById("dhead");
           qnx.innerHTML="No Instructions available.";
          }
          else{
          console.log(z2.length);
          qnx=document.getElementById("dhead");
          qnx.innerHTML="Assembly Instructions.";
          qmx=document.getElementById("dp");

          for(k=0;k<z1.length;k++){
           if (k==0){
           qmx.innerHTML="Step"+(k+1).toString()+":";
           qmx.appendChild(document.createElement("br"));
           qmx.innerHTML+=z1[k];
           qmx.appendChild(document.createElement("br"));
           var pic = document.createElement("IMG");
           pic.setAttribute("src", z2[k]);
           pic.setAttribute("width", "100");
           pic.setAttribute("height", "100");
           pic.setAttribute("alt", "No image available");
           qmx.appendChild(pic);
           qmx.appendChild(document.createElement("br"));
           qmx.appendChild(document.createElement("br"));
           }
           else{
           qmx.innerHTML+="Step"+(k+1).toString()+":";
           qmx.appendChild(document.createElement("br"));
           qmx.innerHTML+=z1[k];

           qmx.appendChild(document.createElement("br"));
           var pic = document.createElement("IMG");
           pic.setAttribute("src", z2[k]);
           pic.setAttribute("width", "100");
           pic.setAttribute("height", "100");
           pic.setAttribute("alt", "No image available");
           qmx.appendChild(pic);

           qmx.appendChild(document.createElement("br"));
           qmx.appendChild(document.createElement("br"));
           }
          }}
          ]]>

        }
      </xsl:for-each>
    }
  </script>

<!-- *********************************************************************** -->
<!-- *********************************************************************** -->

</body>

</html>
</xsl:template>
</xsl:stylesheet>
