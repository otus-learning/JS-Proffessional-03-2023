export type PromiseFunc = () => Promise<number>;
export type OurReduceFunc = (memo : number, value : number) => number;

const fn1 : PromiseFunc = () => {
	console.log('fn1')
	return Promise.resolve(1)
};

const fn2 : PromiseFunc = () => new Promise((resolve) => {
	console.log('fn2')
	setTimeout(() => resolve(2), 1000)
});

const reduce : OurReduceFunc = (memo : number, value : number) : number => {
	console.log('reduce');
	return memo * value;  
}

const asyncFunctions = [fn1, fn2];

/*
function promiseReduce(asyncFunctions, reduce, initialValue) {
	let idx = 1;
	return (asyncFunctions.length) ? new Promise((resolve) => {
		asyncFunctions[0]().then(function thenFn(data) {
			initialValue = reduce(initialValue, data);
			(idx === asyncFunctions.length) ? resolve(initialValue) : asyncFunctions[idx ++]().then(thenFn);
		});
	}) : Promise.resolve(initialValue);
};
*/

/*
export function promiseReduce(asyncFunctions : Array<PromiseFunc>, reduce : OurReduceFunc, initialValue : number) : Promise<number> {
	return (asyncFunctions.length) ? asyncFunctions.reduce((prev, curr) => 
		prev.then(memo => {
			return new Promise(resolve => curr().then(data => resolve(reduce(memo, data))))
		}), Promise.resolve(initialValue)) : Promise.resolve(initialValue);
};
*/


export function promiseReduce(asyncFunctions : Array<PromiseFunc>, reduce : OurReduceFunc, initialValue : number) : Promise<number> {
	return (asyncFunctions.length) ? asyncFunctions.reduce(async (prev : Promise<number>, curr : PromiseFunc) => {
		const memo = await prev;
		const data = await curr();
		return Promise.resolve(reduce(memo, data));
		}, Promise.resolve(initialValue)) : Promise.resolve(initialValue);
};

promiseReduce([fn1, fn2], reduce, 1).then(console.log);
