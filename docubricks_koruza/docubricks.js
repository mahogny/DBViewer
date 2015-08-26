
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
	for(var i=0;i<lev.length;i++){
		
		var etop = document.createElement("li");
		elemTree.appendChild(etop);
		
		var elem = document.createTextNode(m[lev[i].brickid].name);
		etop.appendChild(elem);
		
		var elemChild = document.createElement("ul");
		elemTree.appendChild(elemChild);
		
		renderBricksTreeR(db, lev[i].children, elemChild, m);
	}
}

/**
 * Render the tree
 */
function renderBricksTree(db){
	
	//Find out tree structure
	var bt = getBricksTree(db);

	//Output the tree
	var m = getBricksMap(db);
	var elemTree = document.getElementById("ptree");
	var elemChild = document.createElement("ul");
	elemTree.appendChild(elemChild);
	
	renderBricksTreeR(db, bt, elemChild, m);

	//console.log(getPhysicalPartCount(db));
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
	var m = getBricksMap(db);
	var ret = [];
	var tb = getTopBricks(db);
	for(var i=0;i<tb.length;i++)
		ret.push(getBricksTreeR(m, tb[i]));
	return ret;
}

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
					console.log(q);
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




function Display(data) {
	var output = document.getElementById("output");

	//Show("Data from URL: "+url);

	if (data && data.physical_part) {
		if (data.physical_part.length) {
			// multiple statuses
			for (var i=0, sl=data.physical_part.length; i < sl; i++) {
				Show(data.physical_part[i]);
			}
		}
		else {
			// single status
			Show(data.physical_part);
		}
	}

	// display item
	function Show(physical_part) {
		if (typeof physical_part != "string") {
			physical_part = physical_part.description;
		}
		var p = document.createElement("p");
		p.appendChild(document.createTextNode(physical_part));
		output.appendChild(p);
	}

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



function loadxml2(){
	//think this can be done less convoluted?
	xmls = document.getElementById("hiddendata").children[0];
	xmls = new XMLSerializer().serializeToString(xmls);
	xmls = string2xml(xmls).documentElement;
	
	console.log(xmls);
	
	populatePage(XML2jsobj(xmls));
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
	
	/////////////////////////////////////
	var q1=document.createElement("a");
	q1.setAttribute("class", "name");
	q1.setAttribute("href","#");
	var qn=document.createTextNode(db.project_name); ///////////// TODO: use top-level brick name
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
	var dx=document.getElementById("ccentre");
	var spaces=document.createElement("br");
	dx.appendChild(spaces);
	var spaces=document.createElement("br");
	dx.appendChild(spaces);

	//Set title based on the top brick name
	var tb = getTopBricks(db);
	for(var i=0;i<tb.length;i++){
		var b=getBricksMap(db)[tb[i]];
		document.title = b.name;
	}
	
	//Add all the bricks
	for (var i=0; i < db.unit.length; i++) {
		var thisunit=db.unit[i];
		addBrick(dx, thisunit);
	}
		
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
function addBrick(dx, thisunit){
	var nm = thisunit.name;

	////////////////////////////////////////////////////////////////////////
	// Title with abstract
	var qj1=document.createElement("div");
	qj1.setAttribute("class","row");

	var qj1a=document.createElement("div");
	qj1a.setAttribute("class","col7 colExample");

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


	var plegnodeax=document.createElement("p");
	plegnodeax.setAttribute("align","left");

	thisunit.license=text0(thisunit["license"]);
	if(thisunit.license!=""){
		var txta=document.createTextNode("Licence:");
		plegnodeax.appendChild(txta);
		legalnode.appendChild(plegnodeax);
		
		var txta2=document.createTextNode(thisunit.license);
		plegnodex.appendChild(txta2);
		legalnode.appendChild(plegnodex);
		
		anyLegal=true;
	}


	if(true){
		var plegnodebx=document.createElement("p");
		plegnodebx.setAttribute("align","left");
		var txtb=document.createTextNode("Authors:");
		plegnodebx.appendChild(txtb);
		legalnode.appendChild(plegnodebx);
	}


	if(true){
		var plegnodecx=document.createElement("p");
		plegnodecx.setAttribute("align","left");
		var txtc=document.createTextNode("Copyright:");
		plegnodecx.appendChild(txtc);
		legalnode.appendChild(plegnodecx);
	}

	if(anyLegal)
		dx.appendChild(legalnode);
	
	//////////////////////////////////////////////////////////////////////////
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
	//////////////////////////////////////////////////////////////////////////


	if(!("assembly_instruction" in thisunit))
		thisunit.assembly_instruction={};
	addInstruction(dx, thisunit, thisunit.assembly_instruction);
	 
}


/**
 * Add one set of instructions
 */
function addInstruction(dx, thisunit, instruction){
	
	instruction.step = atleast1(instruction["step"]);

	var assins=document.createElement("div");
	var aihead=document.createElement("div");
	aihead.setAttribute("class","col12 colExample");
	var aititle=document.createElement("p");
	aititle.setAttribute("align","left");
	var aih1=document.createElement("h1");
	var aihtxt=document.createTextNode(thisunit.name+ " Assembly Instructions.");
	aih1.appendChild(aihtxt);
	aititle.appendChild(aih1);
	aihead.appendChild(aititle);
	assins.appendChild(aihead);


	if (instruction.step.length==0){
		/*
		var nadadiv=document.createElement("div");
		nadadiv.setAttribute("class","col12 colExample");
		var nadap=document.createElement("p");
		nadap.setAttribute("align","left");
		var nadadivtxt=document.createTextNode("No information available");
		nadap.appendChild(nadadivtxt);
		nadadiv.appendChild(nadap);
		nadadiv.appendChild(nadap);
		assins.appendChild(nadadiv);

		dx.appendChild(assins);
		*/
	} else{
			
		for(var muj=0;muj<instruction.step.length;muj++){
			thisstep=instruction.step[muj];
			var aidivn=document.createElement("div");

			var aititle=document.createElement("p");
			aititle.setAttribute("align","left");
			var aih3=document.createElement("h3");
			var saihtxt=document.createTextNode("Step "+(1+muj).toString());

			aih3.appendChild(saihtxt);
			aititle.appendChild(aih3);
			aidivn.appendChild(aititle);

			var aininfo=document.createElement("div");
			aininfo.setAttribute("class","row");

			var stepnimg=document.createElement("div");
			stepnimg.setAttribute("class","col6 colExample");

			///////////////////////////////////////////////////
			// NOOOOOOTE: there can be more than one media file!
			var stimgsrc;
			if("media" in thisstep && "file" in thisstep.media && "url" in thisstep.media.file){
				stimgsrc=thisstep.media.file.url;
				var img=document.createElement("img");
				img.setAttribute("src",stimgsrc);
				img.setAttribute("width","100%");
			} else {
				var img=document.createElement("img");
				//dynamically add an image and set its attribute
				img.setAttribute("src",'images/Logo.png');
				//img.id="picture"
				
			}

			var stepimgp=document.createElement("p")
			stepimgp.setAttribute("align","left");
			stepimgp.appendChild(img);
			stepnimg.appendChild(stepimgp);
			aininfo.appendChild(stepnimg);
			//qj1.appendChild(stepnimg);
			//dx.appendChild();

			/////////////////////////////////////////////////////

			var stepndesc=document.createElement("div");
			stepndesc.setAttribute("class","col6 colExample");
			var aidescp=document.createElement("p");
			aidescp.setAttribute("align","left");
			var aidescptxt=document.createTextNode(thisunit.assembly_instruction.step[muj].description);
			aidescp.appendChild(aidescptxt);
			stepndesc.appendChild(aidescp);
			aininfo.appendChild(stepndesc);

			aidivn.appendChild(aininfo);
			assins.appendChild(aidivn);
			dx.appendChild(assins);
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