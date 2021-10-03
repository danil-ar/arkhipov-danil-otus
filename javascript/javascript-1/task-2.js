function sum(num) {
    const arr = [];
    function fn(x) {
        if (!!x) {
            if (typeof x == "number")
                arr.push(x);
            return fn;
        }
        else return arraySum(arr);
    };
    return fn(num);
};

function arraySum(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += array[i];
    }
    return sum;
}

console.log(sum()); //0
console.log(sum('a')()); //0
console.log(sum(1)()); //1
console.log(sum(1)('a')(5)(1)()); //7
console.log(sum(1)('a')(5)(7)()); //13