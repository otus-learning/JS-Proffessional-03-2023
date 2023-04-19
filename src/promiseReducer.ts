type PromiseFunc = () => Promise;
type OurReduceFunc = (number, number) => number;

const fn1 : PromiseFunc = () => {
	console.log('fn1')
	return Promise.resolve(1)
};

const fn2 : PromiseFunc = () => new Promise((resolve) => {
	console.log('fn2')
	setTimeout(() => resolve(2), 1000)
});

const reduce : OurResuceFunc = (memo : number, value : number) : number => {
	console.log('reduce');
	return memo * value;  
}

const asyncFunctions : Array<PromiseFunc> = [fn1, fn2];

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

promiseReduce([fn1, fn2], reduce, 1).then(console.log);
*/

(asyncFunctions.reduce((prev, curr) => 
	prev.then(memo => {
		return new Promise(resolve => curr().then(data => resolve(reduce(memo, data))))
	//Promise.resolve(1) do make initial value for our reduce function (not Array.reduce)
	}), Promise.resolve(1)
)).then(console.log);
