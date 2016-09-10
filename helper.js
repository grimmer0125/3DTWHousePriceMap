// todo: move the calculation to server side later

function normalize(x, y) {
  // step1: normalize
  // original:
  // x: -100 ~ 100
  // y: -65 ~ 65
  // z: -65 ~ 65

  // now:
  // e.g.   Taipei: 307539.878984418639448, 2787741.076221206225455
  //        澎湖:    96064.329004978004377, 2589059.557838218752295
  //        屏東:   236074.513813270255923, 2526906.461984259076416
  //         高雄:   165371.30034278871608, 2534744.389782814774662
  // ref: http://spatialreference.org/ref/epsg/twd97-tm2-zone-121/
  // bound: 146336.7729, 2370779.8738, 353663.2271, 2916814.3108 (左下右上), deltaY = 546034.1262
  var centerX = 250000; //(146336.7729+353663.2271) /2;
  var centerY = 2643797.0923; // (2370779.8738+2916814.3108)/2
  var multiple = 4200;  // 看deltaY

  return {x: (x-centerX)/multiple, y:(y-centerY)/multiple };
}

// these are needed by ThreeJS
// 兩種, 不會mix
// 1. array of array
// 2. array of array of array

// 1. array

function judgeIfMultipleArray(zone, curveListPerCity, actionListPerCity){

  var object = zone[0][0];

  if (object.constructor === Array){
    console.log("multiple array");

    var numberOfSubZones = zone.length;

    console.log("subzone in this zone:", numberOfSubZones);
    for (var i=0; i< numberOfSubZones; i++) {
      var subZone = zone[i];
      getCurveAndAction(subZone, curveListPerCity, actionListPerCity);
    }

  } else {
    console.log("not array");
    getCurveAndAction(zone, curveListPerCity, actionListPerCity);
  }
}

function getCurveAndAction(zone, curveListPerCity, actionListPerCity){

  var curveList  =[];
  var actionList =[];

  var numberOfPoint = zone.length;

  console.log("points in this zone:", numberOfPoint);
  for (var i=0; i< numberOfPoint; i++) {

    // 如果zone[i]是 number ok 如果是[]則是多層的
    console.log("x:",zone[i][0], ";y:",zone[i][1] );
    var coordiante = normalize(zone[i][0], zone[i][1]);

    if (i==0){
      actionList.push({action:"moveTo", args:[coordiante.x, coordiante.y]});

      console.log("move to ");
    } else {

      var preCoordiante = normalize(zone[i-1][0], zone[i-1][1]);

      var v1 = preCoordiante;
      var v2 = coordiante;
      curveList.push({v1:v1, v2:v2});

      actionList.push({action:"lineTo", args:[coordiante.x, coordiante.y]});

      console.log("line to");
    }

    // final one
    if (i == (numberOfPoint-1)){
      var v1 = coordiante;

      var zeroCoordiante = normalize(zone[0][0], zone[0][1]);

      var v2 = zeroCoordiante;
      curveList.push({v1:v1, v2:v2});

      actionList.push({action:"lineTo", args:[zeroCoordiante.x, zeroCoordiante.y]});

      console.log("final");
    }
  }

  console.log("curveList:", curveList.length);
  console.log("actionList:", actionList.length);

  curveListPerCity.push(curveList);
  actionListPerCity.push(actionList);

  return;
  // return {curveList: curveList, actionList: actionList};
}

function extract(taiwanMap){

  var newMap = {};
  var curves = [];
  var actions = [];
  var data = [];

  var features = taiwanMap.features;
  var featuresLen = features.length;

  console.log("total features/city:", featuresLen);

  for (var i = 0; i< featuresLen; i++){

    console.log("new city/features");

    // geometry part
    var curveListPerCity = [];
    var actionListPerCity =[];

    var feature = features[i];
    var zones = feature.geometry.coordinates; // 因為一個縣市可能有兩個以上不相鄰的地區

    var zoneLen = zones.length;

    for (var j =0; j< zoneLen; j++){

      // should be a polygon
      var zone = zones[j];
      judgeIfMultipleArray(zone, curveListPerCity, actionListPerCity);
      // 所以  zone -  zone1 - sub1
      //      zone -  zone1 - sub2
      // 變成  zone - sub1
      //      zone - sub2  
    }

    curves.push(curveListPerCity);
    actions.push(actionListPerCity);

    // data part
    var name = feature.properties['C_Name'];
    data.push({ppsf:80, st: "Taiwan", ct: name});

    console.log("end city/features");

  }

  return {curves:curves, actions:actions, data:data};
}

function addPrice(taiwanMap){

  return {};
}
