var fetcher = require("./fetcher.js")

fetcher.loadORDownload(function(housePrice){

  console.log("fetch result:", housePrice);
});
