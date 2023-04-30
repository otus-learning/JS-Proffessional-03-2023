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

export async function promiseReduce(asyncFunctions : Array<PromiseFunc>, reduce : OurReduceFunc, memo : number) : Promise<number> {
	for (let f of asyncFunctions) {
		let data = await f();
		memo = reduce(memo, data);
	}

	return Promise.resolve(memo);
};

promiseReduce([fn1, fn2], reduce, 1).then(console.log);
