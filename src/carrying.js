let sum = (arg) => {
  return (arg === undefined) ? 0 : function inner(innerArg) {
    arg += innerArg | 0;    
    return (innerArg === undefined) ? arg : inner;
  };
}

console.log(sum(12)(13)(14)(0)(1)()); //40
console.log(sum()); //0
