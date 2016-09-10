
var CSV = require('comma-separated-values');
// require "comma-separated-values";

// console.log('csv3:',CSV);

// var data = "1850,20,0,1,1017281\r\n\
// 1850,20,0,2,1003841\r\n\
// ";
// new CSV(data).parse();

// A_LVR_LAND_A.csv
// A_LVR_LAND_B.csv

var cityList = [
// {code:""},

{code:"C", name:"基隆市"},
{code:"A", name:"臺北市"},
{code:"F", name:"新北市"},
{code:"H", name:"桃園縣"},
{code:"O", name:"新竹市"},
{code:"J", name:"新竹縣"},
{code:"K", name:"苗栗縣"},
{code:"B", name:"臺中市"},
{code:"M", name:"南投縣"},
{code:"N", name:"彰化縣"},
{code:"P", name:"雲林縣"},
{code:"I", name:"嘉義市"},
{code:"Q", name:"嘉義縣"},
{code:"D", name:"臺南市"},
{code:"E", name:"高雄市"},
{code:"T", name:"屏東縣"},
{code:"G", name:"宜蘭縣"},
{code:"U", name:"花蓮縣"},
{code:"V", name:"臺東縣"},
{code:"X", name:"澎湖縣"},
{code:"W", name:"金門縣"},
{code:"Z", name:"連江縣"}


];

var fs = require('fs');
var iconv = require('iconv-lite');

function getTotal(code, houseType) {
  var fileName =  "./opendata/"+code+ "_LVR_LAND_"+houseType+".CSV";

  // console.log('readFile start');
  var total =0;
  var num = 0;
  var data = fs.readFileSync(fileName);

  // fs.readFile(fileName, function (err, data) {
    // if (err) throw err;
    // console.log('data:', data);
  var str = iconv.decode(data, 'Big5');
  //var str = iconv.fromEncoding(contentBuffer, "big5");
  // console.log('data2:', str);

  var csv = new CSV(str);

  var count=-1;
  csv.forEach(function(record) {
    count++;
    if (count>=1){
      // console.log('price:', record[22]); // it may be zero.  1m2 = 0.3025 坪
      //
      // console.log("type:", record[1]);
      if(record[1] && record[1].indexOf("房地")>=0 && record[22]) {
        var price = record[22]*3.30579;
        // console.log("price per Square footage:", price);
        num++;
        total+=price;
      }
    }
    // do something with the record
  });

  // console.log('total number:', num);
  // if(num>0){
  //   console.log('average:', total/num);
  // }

  return {total:total, number:num}
  // });
}

// var cityList = [
// // {code:""},
//
// {code:"A", name:"臺北市"}
//
//
//
// ];

var newCityList = cityList.slice(0);

var NumOfCity = cityList.length;
for (var i=0; i< NumOfCity; i++){
  var result1 = getTotal(cityList[i].code,"A");
  var result2 = getTotal(cityList[i].code,"B"); //預售屋
  var totalNumber = result1.number+ result2.number;
  console.log('city:', cityList[i].name);
  console.log('total number:', totalNumber);
  var average = 0;
  if(totalNumber>0){
    average = (result1.total+result2.total)/totalNumber;
    console.log('average:', average );
  }
  newCityList[i].price = average;
}

// var fs = require('fs');
fs.writeFile("./data/price.json", JSON.stringify(newCityList) , function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});
