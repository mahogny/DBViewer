
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
 * 
 * Render the tree
 * 
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

	console.log(getPhysicalPartCount(db));

	/*
	console.log();
alert(JSON.stringify(1
));*/
	
	
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
 * 
 * function to return count for physical item
 * 
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

