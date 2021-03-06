import { readdir } from "fs/promises";

async function tree(path) {
    if (typeof path  == "undefined") {
        return "Invalid input arguments. When invoked, you must specify the --path argument, for example: npm run tree -- foo/";
    }
    const results = { files: [], dirs: [] };
    path = path.replace('/', '');
    results.dirs.push(path);
    const files = await scanFs(path, results);
    return files;
}

async function scanFs(path, results) {
    const files = await readdir(path, { withFileTypes: true });
    if (files.length) {
        await Promise.all(
            files.map((file) => {
                const filePath = path + "/" + file.name;
                if (file.isDirectory()) {
                    results.dirs.push(filePath);
                    return scanFs(filePath, results);
                } else {
                    return results.files.push(filePath);
                }
            })
        );
    }
    return results;
}

tree(process.argv[2]).then((data) => console.log(data));