/* 
  CTA MAP
  - Plotting cta trains
  - Author: hewham
*/


import "./chota.css";
import "./styles.css";
const version = require("./package.json").version;

const stations = require("./data/json/stations.json");
const stops = require("./data/json/Lstops.json");
const lines = require("./data/json/lines.json");
let trains = [];

const STATION_OPACITY = "33";
const STATION_RADIUS = "2"
const TRAIN_OPACITY = "ff";
const TRAIN_RADIUS = "4";

// const MAP_TILE = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const MAP_TILE = "https://api.maptiler.com/maps/pastel/{z}/{x}/{y}.png?key=OHqswsdz81Im8uc9ylxp";
const TRANSIT_TILE = "https://1.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day.transit/13/{z}/{x}/{y}/png8?apiKey=TYjZLDs5mcyHqFZkIYTU7MRWdO0YZ8DoEyCzIVRYVE0"

// Supported values for rt are: "Red", "Blue", "Brn", "G", "Org", "P", "Pink", "Y".
const URL = "http://lapi.transitchicago.com/api/1.0/ttpositions.aspx?key=298af116f70948a7a9c5561c7050202c&outputType=JSON&rt=Red,Blue,Brn,G,Org,P,Pink,Y"

const prefix = "http://0.0.0.0:8080/"
// const Handlebars = require("handlebars");
// var itemsTemplate = Handlebars.compile(document.getElementById("items-template").innerHTML);
// document.getElementById("loading").innerHTML = loadingTemplate({isLoading});

var map = L.map('mainmap').setView([41.8871, -87.7098], 11);
var loopmap = L.map('loopmap').setView([41.8810, -87.6298], 16);
// L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);

L.tileLayer(MAP_TILE).addTo(map)
L.tileLayer(MAP_TILE).addTo(loopmap);

// L.tileLayer(TRANSIT_TILE).addTo(map);
// L.tileLayer(TRANSIT_TILE).addTo(loopmap);

// L.tileLayer('http://tile.thunderforest.com/transport/{z}/{x}/{y}.png').addTo(loopmap);


main();

function main() {
  drawStops();

  // startPoll();
  httpGet(prefix + URL);
}

function startPoll() {
  setInterval(() => {
    // httpGet(URL);
  }, 1000 * 60 * 2)
}

function handleResponse(res) {
  console.log("res: ", res);

  let resLines = res.ctatt.route;
  for(let line of resLines) {
    if(line.train) {
      if(Array.isArray(line.train)) {
        for(let train of line.train) {
          trains.push({line: line['@name'], nextStop: train.nextStpId})
        }
      } else {
        trains.push({line: line['@name'], nextStop: line.train.nextStpId})
      }
    }
  }

  // console.log("trains: ", trains);

  for(let train of trains) {
    let stop = getStopById(train.nextStop);
    let line = getLineByColor(train.line);
    L.circleMarker(extractLocation(stop.Location), {
      radius: TRAIN_RADIUS,
      color: line.color + TRAIN_OPACITY
    }).addTo(map).addTo(loopmap);
  }

}

function getStopById(id) {
  for(let stop of stops) {
    if(stop.STOP_ID == id) {
      return stop;
    }
  }
  return null;
}

function getLineByColor(color) {
  for(let line of lines) {
    if(line.route.toLowerCase() == color.toLowerCase()) {
      return line;
    }
  }
}

function drawStops() {
  for(let stop of stops) {
    for(let line of lines) {
      if(stop[line.name]) {
        L.circleMarker(extractLocation(stop.Location), {
          radius: STATION_RADIUS,
          color: line.color + STATION_OPACITY
        }).addTo(map).addTo(loopmap);;
      }
    }
  }
}


function extractLocation(location) {
  // input format: "(lat, lng)"
  // output format: [lat, lng]
  location = location.substr(1, location.length - 2);
  let strs = location.split(", ");
  strs[0] = parseFloat(strs[0]);
  strs[1] = parseFloat(strs[1]);
  return strs;
}

function httpGet(url)
{
  fetch(url).then(function(response) {
    return response.json();
  }).then(function(res) {
    handleResponse(res);
  }).catch(function(e) {
    console.log("Booo, ", e.message);
  });
}



