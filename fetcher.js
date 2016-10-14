
// var testGlobal = 1;
// testGloba2 = 2;

var iconv = require('iconv-lite');
var parser = require('./parser.js');


var JSZip = require("jszip");
// var JSZipUtils = require("jszip-utils");
var fetch = require('node-fetch');

const dataURL = "http://data.moi.gov.tw/MoiOD/System/DownloadFile.aspx?DATA=F0199ED0-184A-40D5-9506-95138F54159A";

exports.loadORDownload = function(dataCallback){

    // check storage

    downloadAndParse(dataCallback);
}

var zip =  null;

function downloadAndParse(dataCallback) {

    fetch(dataURL)
        .then(function(res) {
            return res.buffer();
        }).then(function(buffer) {
            // fileType(buffer);

            //byte array
            zip = new JSZip();
            zip.loadAsync(buffer)
            .then(function() {

                console.log('unzip completed!');

                // comment temporarily
                parser.parseHouseCSV(readEachCSVFile, cityData => {
                    console.log("houseData:", cityData);
                    const newData = cityData.map(city=>{
                        var finalNum = 0;
                        if(city.price<0){
                            finalNum ="error";
                        } else if (city.price ==0) {
                            finalNum = "沒有交易";
                        } else {
                            finalNum = (Math.round(city.price)).toString().replace(/\B(?=(\d{3})+(?!\d))/g,
                                  ",");
                        }

                        return city.name+":$"+finalNum;
                    });
                    console.log("new:", newData);
                    // newData.splice(0, 0, title);
                    // storage.save(newData);

                    dataCallback(newData);
                });
            });

        });

    // JSZipUtils.getBinaryContent(dataURL, function(err, data) {
    //
    //     // console.log("try foo1:", foo.grabAppleData());
    //     // JSZipUtils.getBinaryContent('https://grimmer.io/test/test.zip', function(err, data) {
    //     if (err) {
    //         throw err; // or handle err
    //     }
    //
    //
    //     // zip.loadAsync(data, {
    //     //     decodeFileName: function (bytes) {
    //     //         return iconv.decode(bytes, 'Big5');
    //     //     }
    //     // });
    //
    //     //byte array
    //     zip = new JSZip();
    //     zip.loadAsync(data)
    //     .then(function() {
    //
    //         console.log('unzip compvared!');
    //
    //         // comment temporarily
    //         parser.parseHouseCSV(readEachCSVFile, cityData => {
    //             console.log("houseData:", cityData);
    //             const newData = cityData.map(city=>{
    //                 var finalNum = 0;
    //                 if(city.price<0){
    //                     finalNum ="error";
    //                 } else if (city.price ==0) {
    //                     finalNum = "沒有交易";
    //                 } else {
    //                     finalNum = (Math.round(city.price)).toString().replace(/\B(?=(\d{3})+(?!\d))/g,
    //                           ",");
    //                 }
    //
    //                 return city.name+":$"+finalNum;
    //             });
    //             console.log("new:", newData);
    //             // newData.splice(0, 0, title);
    //             // storage.save(newData);
    //
    //             dataCallback(newData);
    //         });
    //     });
    // });
}


function readEachCSVFile(code, houseType, finishReadFun) {

    const readfilepath = code + "_LVR_LAND_" + houseType + ".CSV";

    console.log('try to read:', readfilepath);

    console.log("iterating over", readfilepath);

    zip.file(readfilepath).async("uint8array").then(function(text) {
        // console.log("unzip:", text);
        var str = iconv.decode(text, 'Big5');
        console.log("total data length:", str.length);
        // console.log("unzip:", str);
        finishReadFun(str);
    });


    // var data = ''
    // RNFetchBlob.fs.readStream(
    // // encoding, should be one of `base64`, `utf8`, `ascii`
    // readfilepath, `big5`, 1095000 //should set large enough
    // // file path
    // // 4K buffer size.
    // // (optional) buffer size, default to 4096 (4095 for BASE64 encoded data)
    // // when reading file in BASE64 encoding, buffer size must be multiples of 3.
    // ).then((ifstream) => {
    //     ifstream.open()
    //     ifstream.onData((chunk) => {
    //         // when encoding is `ascii`, chunk will be an array contains numbers
    //         // otherwise it will be a string
    //         data += chunk
    //
    //         // [asciiArray addObject:[NSNumber numberWithChar:bytePtr[i]]];
    //         // when encoding is `ascii`, chunk will be an array contains numbers
    //
    //         // console.log("chunk size:%s", chunk.length);
    //
    //         // str = iconv.decode(new Buffer(chunk), 'Big5');
    //         // console.log("final:", str);
    //     })
    //     ifstream.onError((err) => {
    //         console.log('oops-err', err); // not exist case and other cases
    //     })
    //     ifstream.onEnd(() => {
    //
    //         //handle data
    //         console.log("total data length:", data.length);
    //         finishReadFun(data);
    //     })
    // })
}
