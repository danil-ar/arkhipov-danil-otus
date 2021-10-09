var fn1 = () => {
    console.log("fn1");
    return Promise.resolve(1);
};

var fn2 = () =>
    new Promise((resolve) => {
        console.log("fn2");
        setTimeout(() => resolve(2), 1000);
    });

//v1
function promiseReduce(asyncFunctions, reduce, initialValue) {
    let promise = new Promise(function (resolve, reject) {
        /*
        Promise.resolve()
            .then(asyncFunctions[0])
            .then(function (values) {
                return (initialValue = reduce(initialValue, values));
            })
            .then(asyncFunctions[1])
            .then(function (values) {
                return (initialValue = reduce(initialValue, values));
            })
            .then(function () {
                resolve(initialValue);
            });
        */
        let promiseStart = Promise.resolve();
        for (let fn of asyncFunctions) {
            promiseStart = promiseStart.then(fn).then((values) => {
                initialValue = reduce(initialValue, values);
            });
        }
        promiseStart.then(function () {
            resolve(initialValue);
        });
    });
    return promise;
}

//v2
let i = 0;
function promiseReduce_v2(asyncFunctions, reduce, initialValue) {
    let promise = new Promise(function (resolve, reject) {
        asyncFunctions[i]().then((values) => {
            initialValue = reduce(initialValue, values);
            i++;
            if (i < asyncFunctions.length) {
                resolve(promiseReduce_v2(asyncFunctions, reduce, initialValue));
            } else {
                resolve(initialValue);
            }
        });
    });
    return promise;
}

promiseReduce(
    [fn1, fn2],
    function (memo, value) {
        console.log("reduce");
        return memo * value;
    },
    1
).then(console.log);