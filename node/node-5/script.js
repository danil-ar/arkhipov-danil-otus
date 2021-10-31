const fs = require("fs");
const readline = require("readline");
const utils = require("./utils");

const onSortFileName = "onSortFile.txt";
const sortFileName = "sortFile.txt";
const numberRandomMin = 1;
const numberRandomMax = 9999999;
const fileSizeMB = 100;
const tempFileSizeMB = 5;

async function start() {
    console.log("Start");
    console.log("Этап 0");
    utils.createLimitFile(onSortFileName, fileSizeMB, numberRandomMin, numberRandomMax, true);
    console.log("Этап 1");
    let tempFileNames = await createTempFiles();
    console.log("Этап 2 и 3");
    await sortFile(tempFileNames).then(console.log);
    tempFileNames.forEach((item) => {
        utils.deleteFile(item);
    });
    console.log("End");
}

start();

async function createTempFiles() {
    return new Promise((res) => {
        const tempFileNames = [];
        const rl = readline.createInterface({
            input: fs.createReadStream(onSortFileName),
            terminal: false,
        });
        const lines = [];
        let tempNum = 0;
        rl.on("line", function (line) {
            lines.push(line);
            if (utils.getArraySizeMB(lines) > tempFileSizeMB) {
                tempFileName = `temp_${tempNum}.txt`;
                createTempFile(lines, tempFileName);
                tempFileNames.push(tempFileName);
                tempNum++;
                lines.length = 0;
            }
        });
        rl.on("close", function () {
            tempFileName = `temp_${tempNum}.txt`;
            createTempFile(lines, tempFileName);
            tempFileNames.push(tempFileName);
            res(tempFileNames);
        });
    });
}

function createTempFile(line, fileName) {
    line.sort((a, b) => a - b);
    utils.deleteFile(fileName);
    utils.createFile(line.join("\n"), fileName, true);
}

async function sortFile(tempFileNames) {
    return new Promise((res) => {
        const streams = [];
        const streamValues = [];
        const sortFileWriteStream = fs.createWriteStream(sortFileName);
        tempFileNames.forEach((item, index) => {
            const readStream = fs.createReadStream(item,{highWaterMark:100});
            const readLine = readline.createInterface(readStream);
            streamValues[index] = [];
            streams[index] = readStream;
            readLine.on("line", (line) => {
                streamValues[index].push(parseInt(line));
                readLine.pause();
                if (utils.countEmptyArrayItem(streamValues) === 0) {
                    while (true) {
                        let minValue = numberRandomMax + 1;
                        let minValueIndex = null;
                        streamValues.forEach((item, itemIndex) => {
                            if (item !== undefined && item[0] < minValue) {
                                minValue = item[0];
                                minValueIndex = itemIndex;
                            }
                        });
                        sortFileWriteStream.write(`${minValue}\n`);
                        streamValues[minValueIndex].shift();
                        if (streamValues[minValueIndex].length === 0) {
                            if (streams[minValueIndex].readable) {
                                streams[minValueIndex].resume();
                                break;
                            } else {
                                streamValues[minValueIndex] = undefined;
                                if (utils.countUndefinedArrayItem(streamValues) === 0) {
                                    sortFileWriteStream.end();
                                    break;
                                }
                            }
                        }
                    }
                }
            });
        });
        sortFileWriteStream.on("finish", function () {res(`Файл ${sortFileName} создан, размер: ${utils.getFileSizeMB(sortFileName)}MB`);
        });
    });
}