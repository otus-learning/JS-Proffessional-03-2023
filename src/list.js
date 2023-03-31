//it just fast-borned simple algorithm from the head, I think it does not too fast and memory optimized

//uncomment items for larger result list 
//"r" extends list for "v"
//"d" extends list for "d, x, y, t, l, m, z"
//"d + l" extends for "d, x, y, t, l, m, z, f, g"
//uncommenting only "l" extends for none
let prodsList = [["q", "w", "a"], ["a", "b"/*, "d"*/], ["a","c"], ["q", "e"], ["q", "r"], ["x", "y", "z"], ["x", "d"], ["z", "m"], ["f",  "g"/*, "l"*/], ["t", "l", "y"], [/*"r", */"v"]];

//if result is an object, algorithm must to be too match faster, because "indexOf" did not used
let result = [];

let uniProds = {};
let mostPopular = {name : "",
                   popularity : 0}

prodsList.forEach((list) => {
	if (list.length < 2) {
		return;
	}

	for (let name of list) {
		uniProds[name] ??= { childs : {}, name : name, popularity : 0 };
		let prod = uniProds[name];    	
		(prod.popularity ++ >= mostPopular.popularity) && (mostPopular = prod);
		//element itself do add to childs tree alwais, its necessary (!!)
		list.forEach((el) => {
			uniProds[el] ??= { childs : {}, name : el, popularity : 0 };
			prod.childs[el] ??= uniProds[el];
			prod = uniProds[el];
		});
	}
});

(getResult = (prod) => {
	if (prod.childs) {
		//if recursion does find existing item, simple waste this tree branch
		for (let name in prod.childs)
		//if it does find non-existing item, adding it to the result list
		if (result.indexOf(prod.childs[name].name) < 0) {
			result.push(prod.childs[name].name);
			getResult(prod.childs[name]);
		}
	}
	return result;
})(mostPopular).sort((a, b) => {
	return a > b; //sort result list by name
	// return uniProds[a].popularity < uniProds[b].popularity; //sort result list by popularity
});

console.log(result);
