

/**
 * Render the tree
 */
function renderBricksTree(db){

	
	/**
	 * Recursively render tree
	 * 
	 * @param db		Database
	 * @param lev		Current level
	 * @param elemTree	XML-element to render into
	 * @param m			Brick map
	 * 
	 */
	function renderBricksTreeR(db,lev,elemTree, m){	
		console.log(lev);
		//Add new instance of BOM
		var form2 = $("#lefttreeinstance").get(0).cloneNode(true);
		elemTree.appendChild(form2);
		var tbody=$(form2).find("#lefttreesubdiv");
		var thead=$(form2).find("#lefttreenode");

		var div=document.createElement("div");
		div.setAttribute("class","lefttreenode")
		thead.get(0).appendChild(div);
		thead.attr("href","#brick_"+lev.brickid);
		
		div.appendChild(document.createTextNode(m[lev.brickid].name));

		for(var i=0;i<lev.children.length;i++){
			renderBricksTreeR(db, lev.children[i], tbody.get(0), m);
		}
	}

	//Find out tree structure
	var bt = getBricksTree(db);

	//Output the tree
	var m = getBricksMap(db);
	var elemTree = document.getElementById("ptree2");

	for(var i=0;i<bt.length;i++){
		renderBricksTreeR(db, bt[i], elemTree, m);
	}
}














/**
 * Get a JSON map   unitID => unit
 */
function getBricksMap(db) {	
	var ret={};
	pforeach(db["unit"],function(unit){
		ret[unit.id]=unit;
	});
	return ret;
}

/**
 * Get a JSON map   partID => part
 */
function getPartsMap(db) {	
	var ret={};
	pforeach(db["physical_part"],function(p){
		ret[p.id]=p;
	});
	return ret;
}



/**
 * Make scalar into an array if needed
 */
function atleast1(elem){
	if(elem==undefined)
		elem=[];
	else if(elem.length==undefined)
		elem=[elem];
	return elem;
}


/**
 * For-each over an element that can be a scalar and undefined
 */
function pforeach(elem,f){
	elem=atleast1(elem);
	for(var i=0;i<elem.length;i++)
		f(elem[i]);
}

/**
 * Get the top level bricks in the database
 */
function getTopBricks(db){
	//Make a list of referenced nodes
	var usednodes = {};
	pforeach(db["unit"],function(unit){
		pforeach(unit["logical_part"], function(lu){
			pforeach(lu["implementation"], function(imp){
				if(imp.type=="unit")
					usednodes[imp.id]=1;
			});
		});
	});

	//Keep only nodes without references
	var hasnodes = [];
	pforeach(db["unit"],function(unit){
		if(usednodes[unit.id]!=1) {
			hasnodes.push(unit.id);
		}
	});
	return hasnodes;
}
	



/**
 * Get a tree of bricks. Returns LIST
 * 
 * LIST := [TREE]
 * TREE := {brickid:id, children:LIST}
 */
function getBricksTree(db){
	
	
	function getBricksTreeR(m,parentid){
		var ret = {brickid:parentid, children:[]};
		pu = m[parentid];
		pforeach(pu["logical_part"], function(lu){
			pforeach(lu["implementation"], function(imp){
				if(imp.type=="unit")
					ret.children.push(getBricksTreeR(m, imp.id));
			});
		});
		return ret;
		//TODO handle circular dependencies
	}
	
	var m = getBricksMap(db);
	var ret = [];
	var tb = getTopBricks(db);
	for(var i=0;i<tb.length;i++)
		ret.push(getBricksTreeR(m, tb[i]));
	return ret;
}




/**
 * Function to return count for physical item
 */
function getPhysicalPartCount(db){
	//Set all to 0
	var partcount = {};
	pforeach(db["physical_part"],function(part){
		partcount[part.id]=0;
	});
	
	function getPhysicalPartCountR(m,parentid){
		pu = m[parentid];
		pforeach(pu["logical_part"], function(lu){
			pforeach(lu["implementation"], function(imp){
				if(imp.type=="physical_part"){
					var q=lu.quantity;
					if(isNaN(q))
						q="1";
					partcount[imp.id] += parseInt(q);
				} else if(imp.type=="unit") {
					getPhysicalPartCountR(m,imp.id);
				}
			});
		});
		//TODO handle circular dependencies
	}
	
	//Count recursively
	var m = getBricksMap(db);
	var tb = getTopBricks(db);
	for(var i=0;i<tb.length;i++)
		getPhysicalPartCountR(m, tb[i], partcount);
	
	return partcount;
}





/**
 * Turn XML into string
 */
function getXmlString($xmlObj){   
    var xmlString="";
    $xmlObj.children().each(function(){
        xmlString+="<"+this.nodeName+">";
        if($(this).children().length>0){
            xmlString+=getXmlString($(this));
        }
        else
            xmlString+=$(this).text();
        xmlString+="</"+this.nodeName+">";
    });
    return xmlString;
}


/**
 * Extract XML from a string
 */
function string2xml(txt){
	if (window.DOMParser){
		parser=new DOMParser();
		return parser.parseFromString(txt,"text/xml");
	} else { // Internet Explorer 
		xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async=false;
		xmlDoc.loadXML(txt);
		return xmlDoc;
	} 
}



/**
 * Load the XML the XSLT inserted
 */
function loadxml2(){
	//think this can be done less convoluted?
	xmls = document.getElementById("hiddendata").children[0];
	xmls = new XMLSerializer().serializeToString(xmls);
	xmls = string2xml(xmls).documentElement;
	
	populatePage(XML2jsobj(xmls));
}


/**
 * Get the name of the project (=top brick name)
 */
function getNameOfProject(db){
	//Get name of project
	var tb = getTopBricks(db);
	for(var i=0;i<tb.length;i++){
		var b=getBricksMap(db)[tb[i]];
		return b.name;
	}
	return "";
}

/**
 * 
 * The function that takes a document and populates the page with content
 * 
 * @param db
 */
function populatePage(db){

	//Make the left-side tree
	renderBricksTree(db);

	//Set title based on the top brick name
	document.title=getNameOfProject(db);

	var dx=document.getElementById("ccentre");

	/*
	/////////////////////////////////////
	var q1=document.createElement("a");
	q1.setAttribute("class", "name");
	q1.setAttribute("href","#");
	var qn=document.createTextNode(getNameOfProject(db)); 
	q1.appendChild(qn);
	qx=document.getElementById('name-box');
	qx.appendChild(q1);

	for (var i=0; i < db.unit.length; i++) {
		var qj=document.createElement("a");
		qj.setAttribute("class", "button");
		qj.setAttribute("href","#");
		qj.setAttribute("style", "text-align: right; font-size: .35rem; font-weight: 400; line-height: 34px; letter-spacing= .1rem; padding: 0 9px;");
		var qn=document.createTextNode("brk"+i.toString());
		qj.appendChild(qn);
		qy=document.getElementById("cola");
		qy.appendChild(qj);
	}
	//Create body
	var spaces=document.createElement("br");
	dx.appendChild(spaces);
	var spaces=document.createElement("br");
	dx.appendChild(spaces);
*/

	
	
	//Add all the bricks, in natural order
	var flatlistbricks = flattenBricksTree(db);
	var m = getBricksMap(db);
	for (var i=0; i < flatlistbricks.length; i++) {
		var thisunit=m[flatlistbricks[i]];
		addBrick(dx, thisunit, db);

		var br=document.createElement("br");
		br.setAttribute("clear","all");
		dx.appendChild(br);
		for(var o=0;o<3;o++) //must be possible to do this better
			dx.appendChild(document.createElement("br"));
	}
	
	
	//Add the total BOM
	addTotalBOM(dx,db);
	
}

/**
 * Return a string as "" if undefined
 */
function text0(t){
	if(t!=undefined && t.length!=undefined)
		return t;
	else
		return "";
} 

/**
 * Add one brick
 */
function addBrick(dx, thisunit, db){
	var nm = thisunit.name;

	
	////////////////////////////////////////////////////////////////////////
	// Link here
	var anch=document.createElement("a");
	anch.setAttribute("name","brick_"+thisunit.id);
	dx.appendChild(anch);
	
	////////////////////////////////////////////////////////////////////////
	// Title with abstract
	var qj1=document.createElement("div");
	qj1.setAttribute("class","row");

	var qj1a=document.createElement("div");
	qj1a.setAttribute("class","project_title");
//	qj1a.setAttribute("class","col7 colExample");

	var pqja=document.createElement("p");
	pqja.setAttribute("align","left");

	var h1a=document.createElement("h1");
	var t1a=document.createTextNode("Brick: "/*+(i+1).toString()+":"*/+thisunit.name);
					//TODO should rather check what is the top-level brick! best to separate out the code to place one component into a separate method
											
	h1a.appendChild(t1a);
	pqja.appendChild(h1a);
	qj1a.appendChild(pqja);
	qj1.appendChild(qj1a);
	dx.appendChild(qj1);

	thisunit.abstract=text0(thisunit["abstract"]);
	if(thisunit.abstract!=""){
		var pqjb=document.createElement("p");
		pqjb.setAttribute("align","left");
		var text=document.createTextNode(thisunit.abstract);
		pqjb.appendChild(text);
		qj1a.appendChild(pqjb);
	}

	////////////////////////////////////////////////////////////////////////
	// Representative image
	if(false){
		var toi=typeof thisunit.media[0];
		var qj1b=document.createElement("div");
		qj1b.setAttribute("class","col5 colExample");
		var img=document.createElement("img");
		if(toi == "undefined"){
							//dynamically add an image and set its attribute
			img.setAttribute("src",'images/Logo.png');
								//img.id="picture"
		}else{
			img.setAttribute("src",thisunit.media[0]);
							//img.id="picture"
		}
		qj1b.appendChild(img);
		qj1.appendChild(qj1b);
	}
	
	
	dx.appendChild(qj1);

	var wwhow=document.createElement("div");
	wwhow.setAttribute("class","row");

	////////////////////////////////////////////////////////////////////////
	// The top what/why/how
	addsomehow(dx, thisunit, "what", "What: ");
	addsomehow(dx, thisunit, "why", "Why: ");
	addsomehow(dx, thisunit, "how", "How: ");

	///////////////////////////////////////////////////////////////////////////
	// Legal
	
	var anyLegal=false;
	
	var legalnode=document.createElement("div")
	legalnode.setAttribute("class","col12 colExample");

	var qlegnodea=document.createElement("p");
	qlegnodea.setAttribute("align","left");
	var qlegnodeb=document.createElement("h1");
	var qlegnodec=document.createTextNode("Legal.");
	qlegnodeb.appendChild(qlegnodec);
	qlegnodea.appendChild(qlegnodeb);
	legalnode.appendChild(qlegnodea);


	thisunit.license=text0(thisunit["license"]);
	if(thisunit.license!=""){
		var plegnodex=document.createElement("p");
		plegnodex.setAttribute("align","left");
		
		plegnodex.appendChild(document.createTextNode("Licence:"));
		plegnodex.appendChild(document.createTextNode(thisunit.license));
		legalnode.appendChild(plegnodex);
		
		anyLegal=true;
	}


	if(true){
		var plegnodebx=document.createElement("p");
		plegnodebx.setAttribute("align","left");
		plegnodebx.appendChild(document.createTextNode("Authors:"));
		legalnode.appendChild(plegnodebx);
		anyLegal=true;
	}


	if(true){
		var plegnodecx=document.createElement("p");
		plegnodecx.setAttribute("align","left");
		var txtc=document.createTextNode("Copyright:");
		plegnodecx.appendChild(txtc);
		legalnode.appendChild(plegnodecx);
		anyLegal=true;
	}

	if(anyLegal)
		dx.appendChild(legalnode);
	
	//////////////////////////////////////////////////////////////////////////
	/*
	var insnode=document.createElement("div");
	insnode.setAttribute("class","row");

	var insa=document.createElement("div");
	insa.setAttribute("class","col4 colExample");
	var lka=document.createElement("a");
	lka.setAttribute("href","#");
	var htxlka=document.createElement("h4");
	var txlka=document.createTextNode("Assembly Instructions");
	htxlka.appendChild(txlka);
	lka.appendChild(htxlka);
	insa.appendChild(lka);

	insnode.appendChild(insa);

	var insb=document.createElement("div");
	insb.setAttribute("class","col4 colExample");
	var lkb=document.createElement("a");
	lkb.setAttribute("href","#");
	var htxlkb=document.createElement("h4");
	var txlkb=document.createTextNode("Test Instructions");
	htxlkb.appendChild(txlkb);
	lkb.appendChild(htxlkb);
	insb.appendChild(lkb);

	insnode.appendChild(insb);

	var insc=document.createElement("div");
	insc.setAttribute("class","col4 colExample");
	var lkc=document.createElement("a");
	lkc.setAttribute("href","#");
	var htxlkc=document.createElement("h4");
	var txlkc=document.createTextNode("BOM");
	htxlkc.appendChild(txlkc);
	lkc.appendChild(htxlkc);
	insc.appendChild(lkc);

	insnode.appendChild(insc);
	dx.appendChild(insnode);
	*/
	
	//////////////////////////////////////////////////////////////////////////
	// Assembly
	if(!("assembly_instruction" in thisunit))
		thisunit.assembly_instruction={};
	addInstruction(dx, thisunit, thisunit.assembly_instruction);

	
	////////////////////////////////////////////////////////////////////////
	// BOM
	addBrickBOM(dx, thisunit, db);
	
}





/**
 * Add total bill of materials
 */
function addTotalBOM(dx, db){
	//Add new instance of BOM
	var form2 = $("#totalbomtable").get(0).cloneNode(true);
	dx.appendChild(form2);
	form2=$(form2);
	var tbody=$(form2).find("#totalbombody");
	
	var pcount = getPhysicalPartCount(db);

	//Add rows
	var brickmap = getBricksMap(db);
	pforeach(db["physical_part"], function(thepart){
		var row = $("#totalbomrow").get(0).cloneNode(true);
		tbody.get(0).appendChild(row);
		row=$(row);
		row.find("#quantity").html(pcount[thepart.id]);
		row.find("#description").html(thepart.description);
		
	});
	
}





/**
 * Add brick bill of materials
 */
function addBrickBOM(dx, thisbrick, db){
	//Add new instance of BOM
	var form2 = $("#brickbomtable").get(0).cloneNode(true);
	dx.appendChild(form2);
	form2=$(form2);
	var tbody=$(form2).find("#brickbombody");
	
	//formBomname.html("foo");

	//Add rows
	var pmap = getPartsMap(db);
	var brickmap = getBricksMap(db);
	pforeach(thisbrick["logical_part"], function(lu){
		pforeach(lu["implementation"], function(imp){
			var row = $("#brickbomrow").get(0).cloneNode(true);
			tbody.get(0).appendChild(row);
			row=$(row);
			var quantity=imp.quantity;
			if(isNaN(quantity))
				quantity="1";
			row.find("#quantity").html(quantity);
			
			if(imp.type=="physical_part"){
				
				var thepart=pmap[imp.id];
				row.find("#description").html(thepart.description);
				

			} else if(imp.type=="unit") {
				
				var thebrick = brickmap[imp.id];

				row.find("#description").html(thebrick.name);

				row.find("#description").attr("href","#brick_"+thebrick.id);

				
			} else 
				console.log("bad imp.type "+imp.type)
		});
	});
	
	
	  
	
}



/**
 * Add one set of instructions
 */
function addInstruction(dx, thisunit, instruction){
	instruction.step = atleast1(instruction["step"]);
	


	if (instruction.step.length==0){

	} else{
		
		//Add new instance of BOM
		var form2 = $("#instructiontable").get(0).cloneNode(true);
		dx.appendChild(form2);
		//var tbody=$(form2).find("#divinstruction");
		form2=$(form2);

		//console.log(tbody);
		
		$(form2).find("#instructionname").html("Assembly instructions");


		
		
		for(var muj=0;muj<instruction.step.length;muj++){
			thisstep=instruction.step[muj];
			
			var row = $("#instructionstep").get(0).cloneNode(true);
			form2.get(0).appendChild(row);
			//row=$(row);
			//row.find("#quantity").html(imp.quantity);

			
			
			
			///////////////////////////////////////////////////
			// NOOOOOOTE: there can be more than one media file!
			// Let any additional images be thumbnails below 
			
			var stepnimg=document.createElement("div");
			stepnimg.setAttribute("class","col6 colExample");
			var stimgsrc;
			if("media" in thisstep && "file" in thisstep.media && "url" in thisstep.media.file){
				stimgsrc=thisstep.media.file.url;
				var img=document.createElement("img");
				img.setAttribute("src",stimgsrc);
				img.setAttribute("width","100%");
				
				
				var stepimgp=document.createElement("p")
				stepimgp.setAttribute("align","left");
				stepimgp.appendChild(img);
				stepnimg.appendChild(stepimgp);
			} else {
				/*
				var img=document.createElement("img");
				//dynamically add an image and set its attribute
				img.setAttribute("src",'images/Logo.png');
				//img.id="picture"
				*/
				
			}
			row.appendChild(stepnimg);


			/////////////////////////////////////////////////////

			var stepndesc=document.createElement("div");
			stepndesc.setAttribute("class","col6 colExample");
			var aidescp=document.createElement("p");
			aidescp.setAttribute("align","left");
			
			
			var aititle=document.createElement("b");
			aititle.appendChild(document.createTextNode("Step "+(1+muj)+". "));
			aidescp.appendChild(aititle);

			
			var aidescptxt=document.createTextNode(text0(thisunit.assembly_instruction.step[muj].description));
			aidescp.appendChild(aidescptxt);
			stepndesc.appendChild(aidescp);
			row.appendChild(stepndesc);

			var br=document.createElement("br");
			br.setAttribute("clear","all");
			row.appendChild(br);
			
//			aidivn.appendChild(aininfo);
//			assins.appendChild(aidivn);
//			dx.appendChild(assins);
		}
	}
	
}
 
 
/**
 * Optionally add: Why, How, What
 */
function addsomehow(dx, thisunit, elem, head){

	var qhow=document.createElement("div");
	if(elem in thisunit && thisunit[elem].length!=undefined){
		qhow.setAttribute("class","col4 colExample");
		var qhowa=document.createElement("p");
		qhowa.setAttribute("align","left");
		var qhowb=document.createElement("h1");
		var qhowc=document.createTextNode(head);
		qhowb.appendChild(qhowc);
		qhowa.appendChild(qhowb);
		qhow.appendChild(qhowa);
		
		var phow=document.createElement("p");
		phow.setAttribute("align","left");
		var text=document.createTextNode(thisunit[elem]);
		phow.appendChild(text);
		qhow.appendChild(phow);
		dx.appendChild(qhow);
	}
	else{
			dx.appendChild(qhow);
	}

}





/**
 * XML2jsobj v1.0
 * Converts XML to a JavaScript object
 * so it can be handled like a JSON message
 *
 * By Craig Buckler, @craigbuckler, http://optimalworks.net
 *
 * As featured on SitePoint.com:
 * http://www.sitepoint.com/xml-to-javascript-object/
 *
 * Please use as you wish at your own risk.
 */
 
function XML2jsobj(node) {

	var	data = {};

	// append a value
	function Add(name, value) {
		if (data[name]) {
			if (data[name].constructor != Array) {
				data[name] = [data[name]];
			}
			data[name][data[name].length] = value;
		}
		else {
			data[name] = value;
		}
	};
	
	// element attributes
	var c, cn;
	for (c = 0; cn = node.attributes[c]; c++) {
		Add(cn.name, cn.value);
	}
	
	// child elements
	for (c = 0; cn = node.childNodes[c]; c++) {
		if (cn.nodeType == 1) {
			if (cn.childNodes.length == 1 && cn.firstChild.nodeType == 3) {
				// text value
				Add(cn.nodeName, cn.firstChild.nodeValue);
			}
			else {
				// sub-object
				Add(cn.nodeName, XML2jsobj(cn));
			}
		}
	}

	return data;

}

























/**
 * Return the the bricks tree as a flat list
 */
function flattenBricksTree(db){

	function flattenBricksTreeR(db,lev,list, m){	
		for(var i=0;i<lev.length;i++){
			var id=lev[i].brickid;
			if($.inArray(id,lev)==-1)
				list.push(id);
			flattenBricksTreeR(db, lev[i].children, list, m);
		}
	}

	//Find out tree structure
	var bt = getBricksTree(db);

	//Output the tree
	var m = getBricksMap(db);
	var list=[];
	flattenBricksTreeR(db, bt, list, m);
	return list;
}
