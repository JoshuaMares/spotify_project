const fs = require('fs');

//read file
// fs.readFile('./files.js', (err, data) => {
//     //this is a callback function as the computer has to go and look for the file
//     if(err){
//         console.log(err);
//     }
//     console.log(data);
//     //gives raw hex data so need to convert to string
//     console.log(data.toString());
// });

//writing file
// fs.writeFile('./test.js', 'console.log("we added this from files.js")', ()=>{
//     console.log('file was written');
//     //if file doesnt exists it creates the file
//     //this actually overwrites the file so be careful with that
// });

//directories
// if(!fs.existsSync('./assets')){
//     fs.mkdir('./assets', (err) => {
//         if(err){
//             console.log(err);
//         }
//         console.log('directory created');
//     })
// }else{
//     console.log('directory already exists');
//     fs.rmdir('./assets', (err) => {
//         if(err){
//             console.log(err);
//         }
//         console.log('folder deleted');
//     });
// }

//deleting files
// if(fs.existsSync('./test.js')){
//     fs.unlink('./test.js', (err) => {
//         if(err){
//             console.log(err);
//         }
//         console.log('file deleted');
//     })
// }

