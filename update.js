var fetcher = require("./fetcher.js")
var fs = require('fs');

fetcher.loadORDownload(function(housePrice, newCityList){

  console.log("fetch result:", housePrice);
  var writeData = "var housePrice ="+JSON.stringify(newCityList)+";"
  fs.writeFile("./data/price.js", writeData , function(err) {
      if(err) {
          return console.log(err);
      }

      console.log("The file was saved!");
  });
});
