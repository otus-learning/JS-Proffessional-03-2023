const fn1 = () => {
	console.log('fn1')
	return Promise.resolve(1)
};

const fn2 = () => new Promise((resolve) => {
	console.log('fn2')
	setTimeout(() => resolve(2), 1000)
});

const reduce = (memo, value) => {
	console.log('reduce');
	return memo * value;  
}

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
