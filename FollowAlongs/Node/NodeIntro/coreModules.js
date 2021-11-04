const path = require("path");
const util = require("util");
const fs = require("fs");

const filesDirectory = path.join(__dirname, "files");

console.clear()
util.log("Hello");
util.log(filesDirectory);

// fs.writeFile( path.join(filesDirectory, "test.txt"), "Hello World written from node.js", (err) => {
//     if(err) {
//         console.log("Error", err);
//     }
// })

const fileContents = fs.readFileSync(path.join(filesDirectory, "test.txt"), "UTF-8");
console.log("From file:", fileContents);