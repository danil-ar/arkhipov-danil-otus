const getPath = require("./getPath");
const fs = require("fs");
const html = fs.readFileSync("./index.html");

//const {JSDOM} = require("jsdom");
//const { document } = (new JSDOM(html)).window;

document.body.innerHTML = html;

test("document should return not null", () => {
    expect(document).not.toBeNull();
});

test("getPath should return unique selector for the element with id 'title'", () => {
    const el = document.getElementById("title");
    const uniqueSelector = getPath(el);

    expect(document.querySelectorAll(uniqueSelector)).toHaveLength(1);
    expect(document.querySelector(uniqueSelector)).toBe(el);
});

test("getPath should return unique selector for an element with a duplicate tag", () => {
    const el = document.querySelectorAll("p")[5];
    const uniqueSelector = getPath(el);

    expect(document.querySelectorAll(uniqueSelector)).toHaveLength(1);
    expect(document.querySelector(uniqueSelector)).toBe(el);
});