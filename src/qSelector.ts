export let qSelector = (el : HTMLElement) => {
	debugger

	let id : string = el.id;
	
	if (id) {
		return `#${id}`;
	}

	let rslt = "";
	while (el.localName !== "html") {
		let name = el.localName;
		let parent = el.parentNode;

		if (!parent) {
			rslt = `${name} > ${rslt}`;
			continue;
		}

		if (el.id) {
			rslt = `#${el.id} > ${rslt}`;
			break;
		}

		let anotherEls = Array.prototype.filter.call(parent.childNodes, ((child : ChildNode) => {
			return ((child as HTMLElement).localName === name);
		}));

		(anotherEls.length > 1) && (name = `${name}:nth-of-type(${anotherEls.indexOf(el) + 1})`);

		rslt = (rslt) ? `${name} > ${rslt}` : name;
		el = parent as HTMLElement;
	}
	return rslt;
}
