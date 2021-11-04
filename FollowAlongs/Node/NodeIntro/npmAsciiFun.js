// var figlet = require("figlet");

// figlet("Hello World!!", function(err, data) {
//     if (err) {
//         console.log("Something went wrong...");
//         console.dir(err);
//         return;
//     }
//     console.log(data);
// })

const imgToAscii = require('ascii-img-canvas-nodejs')

const opts = {}

const asciiImgLocal = imgToAscii('files/node-logo.png', opts)
asciiImgLocal.then ((asciiImgLocal) => {
    console.log(asciiImgLocal);
})