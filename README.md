Can chat at [![Gitter](https://badges.gitter.im/twHousePriceMap/Lobby.svg)](https://gitter.im/twHousePriceMap/Lobby)

# map

## possible todo list 
1. automatically fetch data from [http://data.gov.tw/node/7442](http://data.gov.tw/node/7442),處理過程可參考https://github.com/bing-Guo/taiwan-map-d3
    - either fetch on server side, every half month
    - or fetch on browser, save on localstorage (像cookie一樣的東西), and will expire after half month. This way will keep this app as a pure Front-End app with special backend-server. 可以練習簡單的發http request. 
2. Search function, e.g. type address to get the price
3. dropdown menu to choose different type of data, such as 車位/土地. or 新成屋/中古屋. 
4. UI improvement. (e.g. 放大縮小button)
5. mobile UI/RWD/App version/.
6. Show the price of the smaller zone. Such 大安區. 
7. More statistical data/graph. Such as historical data for the past year.  [http://data.gov.tw/node/18703](http://data.gov.tw/node/18703) or [http://plvr.land.moi.gov.tw/DownloadOpenData](http://plvr.land.moi.gov.tw/DownloadOpenData). Keep in mind, these are Big5 encoding. 
8. ~~improve CPU too high issue.~~

## steps to install
1. (optinal) Install NPM if you do not have, follow the the web. [https://nodejs.org/en/](https://nodejs.org/en/)
2. in the root folder of this project, type `npm install`

## How to run 
1. in the root folder of this project, type `npm start`. It uses [live-server](https://github.com/tapio/live-server) to supports AJAX from the web app downloaded from the local server and page reload automatically. 
