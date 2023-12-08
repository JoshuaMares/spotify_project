//for big files want to take it in line by line as to not overload mem
const fs = require('fs');

const readStream =fs.createReadStream('./temp.txt', {encoding: 'utf8'});
//second param is options param and allows us to encode as it comes in
const writeStream = fs.createWriteStream('./tempw.txt');

// readStream.on ('data', (chunk) => {
//     //.on is even listener
//     //data is the event
//     //so everytime we get a chunk of data we run this callback fxn
//     console.log('_____NEW_CHUNK_____');
//     console.log(chunk);
//     writeStream.write('\nNEW CHUNK\n');
//     writeStream.write(chunk);
// });

//piping
readStream.pipe(writeStream);