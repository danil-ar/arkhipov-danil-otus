const fs = require("fs");

function getFileSizeMB(fileName) {
    const stats = fs.statSync(fileName);
    return stats.size / 1000000.0;
}

function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const createFile = function createFile(line, fileName, logFlg = false) {
    fs.appendFileSync(fileName, line, (err) => {
        if (err) console.log(err);
    });
    if (logFlg)
        console.log(`Файл ${fileName} создан, размер: ${getFileSizeMB(fileName)}MB`);
};

const deleteFile = function deleteFile(fileName) {
    if (fs.existsSync(fileName)) {
        fs.unlinkSync(fileName, (err) => {
            if (err) console.log(err);
        });
    }
};

const createLimitFile = function createLimitFile(fileName, fileSizeMB, numberRandomMin, numberRandomMax, logFlg = false) {
    const arrLength = 100;
    let sNumber;
    deleteFile(fileName);
    do {
        sNumber = (sNumber ? "\n" : "") + Array.from({ length: arrLength }, () => getRandomInRange(numberRandomMin, numberRandomMax)).join("\n");
        createFile(sNumber, fileName);
    } while (getFileSizeMB(fileName) < fileSizeMB);
    if (logFlg)
        console.log(`Файл ${fileName} создан, размер: ${getFileSizeMB(fileName)}MB`);
};

function countEmptyArrayItem(arr) {
    return arr.reduce((count, item) => {
        if (item !== undefined && item.length === 0) return count + 1;
        else return count;
    }, 0);
}

function countUndefinedArrayItem(arr) {
    return arr.reduce((count, item) => {
        if (item !== undefined) return count + 1;
        else return count;
    }, 0);
}

function getArraySizeMB(arr) {
    return (arr.length * 7) / Math.pow(1024, 2);
}

module.exports.createFile = createFile;
module.exports.deleteFile = deleteFile;
module.exports.createLimitFile = createLimitFile;
module.exports.getFileSizeMB = getFileSizeMB;
module.exports.countEmptyArrayItem = countEmptyArrayItem;
module.exports.countUndefinedArrayItem = countUndefinedArrayItem;
module.exports.getArraySizeMB = getArraySizeMB;
