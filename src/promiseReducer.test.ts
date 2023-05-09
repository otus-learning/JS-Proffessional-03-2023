import { PromiseFunc, OurReduceFunc } from "./promiseReducer";
import { promiseReduce } from "./promiseReducer";

describe("promiseReduce func tests", () => {
	it("test that function return initial value if empty array is used", async () => {
		const reducer = jest.fn();
		const result = await promiseReduce([], reducer, 21);
		expect(result).toEqual(21);
	});

	it("test that all functions are called right times", async () => {
		const reducer = jest.fn();
		const fn = jest.fn();
		const promisyfiedFn = () => {
			fn();
			return Promise.resolve(0);
		};
		await promiseReduce([promisyfiedFn, promisyfiedFn, promisyfiedFn], reducer, 1);
		expect(reducer).toHaveBeenCalledTimes(3);
		expect(fn).toHaveBeenCalledTimes(3);
	});

	it("test that function logic is workable", async () => {
		let idx = 1;
		const reducer = (num1 : number, num2 : number) : number => {
			return num1 + num2;
		};

		const fn = () => {
			return Promise.resolve(idx ++);
		};

		const result = await promiseReduce([fn, fn], reducer, 0);
		expect(result).toEqual(3);
	});	
});
