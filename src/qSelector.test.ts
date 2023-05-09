import { qSelector } from "./qSelector";

describe("test get uniq selector path function", () => {

	beforeAll(() => {
		document.body.innerHTML = "";
	});

	it("tests that function result is an HTML element", () => {
		let el1 = document.createElement("h1");
		document.body.appendChild(el1);

		expect(document.querySelectorAll(qSelector(el1))[0].innerHTML).toBeDefined();
	});

	it("tests that was returned only one element by function result string", () => {
		let el1 = document.createElement("p");
		let el2 = document.createElement("p");
		let el3 = document.createElement("p");
		document.body.appendChild(el1);
		document.body.appendChild(el2);
		document.body.appendChild(el3);

		expect(document.querySelectorAll(qSelector(el2)).length).toEqual(1);
		expect(document.querySelectorAll(qSelector(el2))[0]).toEqual(el2);
	});


	it("tests that function stops on first finded ID in the path", () => {
		let el1 = document.createElement("div");
		let el2 = document.createElement("div");
		el2.id = "testID1";
		let el3 = document.createElement("div");
		let el4 = document.createElement("div");
		document.body.appendChild(el1);
		document.body.appendChild(el2);
		el2.appendChild(el3);
		document.body.appendChild(el4);

		let path = qSelector(el3);
		expect(document.querySelectorAll(path)[0]).toEqual(el3);
	});

	it("tests that function return path immediatly if element has it's own ID", () => {
		let el1 = document.createElement("span");
		let el2 = document.createElement("span");
		el2.id = "testID2";
		let el3 = document.createElement("span");
		let el4 = document.createElement("span");
		document.body.appendChild(el1);
		document.body.appendChild(el2);
		document.body.appendChild(el3);
		document.body.appendChild(el4);

		let path = qSelector(el2);
		expect(document.querySelectorAll(path)[0]).toEqual(el2);
	});
});
