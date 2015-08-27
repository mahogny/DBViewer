<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<title>Docubricks Doc</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
		
		<link href="terrier/font-awesome/css/font-awesome.min.css" rel="stylesheet" />
		<link href="terrier/dist/terrierX.css" rel="stylesheet" />
		<link href="docubricks.css" rel="stylesheet" />
		
		<script src="stylesheets/jquery-1.11.3.min.js"></script>
		<script src="docubricks.js"></script>
	</head>

	<!--  Original XML goes in here  -->
	<hiddendata class="hideclass" id="hiddendata">
		<xsl:copy-of select="project"/>
	</hiddendata>
	
	
	<!--  Bill of materials table -->
	<hidden class="hideclass">
		<div class="col12 colExample" id="bricktable">
			<h1 id="bomname">Bill of materials</h1>
			<p align="center">
				<table>
					<thead>
						<tr>
							<th>#</th>
							<th>DESCRIPTION</th>
							<th>QUANTITY</th>
							<th>SUPPLIER</th>
						</tr>
					</thead>
					<tbody id="bombody">
					</tbody>
				</table>
			</p>
		</div>
		<tr id="bomrow">
			<td id="partnum"></td>
			<td><a id="description"> </a></td>
			<td id="quantity"></td>
			<td id="supplier"></td>
		</tr>
	</hidden>
	
	
	
	<body>
	
		<nav id="menu">
			<h1 class="center"></h1>
		</nav>
	
		<main id="panel"> 
			<header id="top-bar" class="barx" style="background: #725DA7;">
				<div class="container">
					<div class="row">
						<div id="name-box" class="col2 colExample"></div>
						<div id="brick-box" class="col9 colExample">
							<nav id="cola"></nav>
						</div>
						<div class="col1 colExample">
							<a class="name" href="#">BOM</a>
						</div>
					</div>
				</div>
			</header>
			<div id="bspace" class="container center">
				<br />
				<br />
				<br />
				<br />
				<br />
			</div>
			<div id="ptree"></div>
			<div id="ccentre" class="container center"></div>
			
			
			<script type="text/javascript">
				loadxml2();
			</script> 
		</main>
	</body>
	
	
	
</html>
</xsl:template>
</xsl:stylesheet>
