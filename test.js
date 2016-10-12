var iconv = require('iconv-lite');


JSZipUtils.getBinaryContent('https://grimmer.io/test/big5text.zip', function(err, data) {

    // JSZipUtils.getBinaryContent('https://grimmer.io/test/test.zip', function(err, data) {
    if (err) {
        throw err; // or handle err
    }

    var zip = new JSZip();

    // zip.loadAsync(data, {
    //     decodeFileName: function (bytes) {
    //         return iconv.decode(bytes, 'Big5');
    //     }
    // });

    //byte array
    zip.loadAsync(data)
    .then(function() {
        console.log("after load");
        //folder("test")
        zip.forEach(function(relativePath, file) {
            console.log("iterating over", relativePath);

            //arraybuffer, uint8array

            if(relativePath === "4.TXT"){
                file.async("uint8array").then(function(text) {
                    console.log("unzip:", text);
                    var str = iconv.decode(text, 'Big5');
                    console.log("unzip2:", str);
                });
            }

        });
    });

    //byte array
    // zip.loadAsync(data).then(function() {
    //     console.log("after load");
    //     //folder("test")
    //     zip.forEach(function(relativePath, file) {
    //         console.log("iterating over", relativePath);
    //
    //         file.async("string").then(function(text) {
    //             console.log("unzip:", text);
    //             var str = iconv.decode(text, 'Big5');
    //             console.log("unzip2:", str);
    //         });
    //     });
    // });
});
