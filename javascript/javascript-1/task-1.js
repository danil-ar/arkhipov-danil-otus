function maxItemAssociation(arrHistoryData) {
    let result = [];
    for (let i = 0; i < arrHistoryData.length; i += 1) {
        let arrIntersect = [];
        for (let j = 0; j < arrHistoryData.length; j += 1) {
            if (intersect(arrHistoryData[i], arrHistoryData[j]).length > 0) {
                arrIntersect = [...arrIntersect, ...arrHistoryData[i]];
                arrIntersect = [...arrIntersect, ...arrHistoryData[j]];
            }
        }
        if (arrIntersect.length > 0)
            result.push([...new Set(arrIntersect)].sort());
    }
    let index = 0;
    let maxCount = 0;
    for (let i = 0; i < result.length; i += 1) {
        if (result[i].length > maxCount) {
            maxCount = result[i].length;
            index = i;
        }
    }
    return result[index];
}

function intersect(a, b) {
    return a.filter((value) => b.includes(value));
}

console.log(
    maxItemAssociation([
        ["a", "b"],
        ["a", "c"],
        ["d", "e"],
    ])
); //["a", "b", "c"]
console.log(
    maxItemAssociation([
        ["q", "w", "a"],
        ["a", "b"],
        ["a", "c"],
        ["q", "e"],
        ["q", "r"],
    ])
); //["a", "b", "c", "e", "q", "r", "w"]
