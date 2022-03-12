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
let stopToStationMap = {};
let allStations = [];

const pollTime = 1000 * 30 * 1;
const STATION_OPACITY = "33";
const STATION_RADIUS = "2"
const TRAIN_OPACITY = "ff";
const TRAIN_RADIUS = "4";

// const MAP_TILE = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const MAP_TILE = "https://api.maptiler.com/maps/pastel/{z}/{x}/{y}.png?key=OHqswsdz81Im8uc9ylxp";
const TRANSIT_TILE = "https://1.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day.transit/13/{z}/{x}/{y}/png8?apiKey=TYjZLDs5mcyHqFZkIYTU7MRWdO0YZ8DoEyCzIVRYVE0"

// Supported values for rt are: "Red", "Blue", "Brn", "G", "Org", "P", "Pink", "Y".
// const URL = "http://lapi.transitchicago.com/api/1.0/ttpositions.aspx?key=298af116f70948a7a9c5561c7050202c&outputType=JSON&rt=Red,Blue,Brn,G,Org,P,Pink,Y"
const URL = "https://api.anonacy.com/v1/functions/cta/trains"
// const URL = "http://localhost:3000/v1/functions/cta/trains"

// const prefix = "http://localhost:3000/v1/functions/cors/"
// const prefix = "https://cors-anywhere.herokuapp.com/"
const prefix = ""
const suffix = ""

const Handlebars = require("handlebars");
var stationsTemplate = Handlebars.compile(document.getElementById("stations-template").innerHTML);

const mapOptions = {
  zoomControl: false, 
  doubleClickZoom: false, 
  closePopupOnClick: false, 
  dragging: false, 
  zoomSnap: false, 
  zoomDelta: false, 
  trackResize: false,
  touchZoom: false,
  scrollWheelZoom: false
}

var map = L.map('mainmap', mapOptions ).setView([41.8871, -87.7098], 11);
var loopmap = L.map('loopmap', mapOptions).setView([41.8810, -87.6298], 15);

L.tileLayer(MAP_TILE).addTo(map)
L.tileLayer(MAP_TILE).addTo(loopmap);

var stationLayer = L.layerGroup().addTo(map);
var stationLayer = L.layerGroup().addTo(loopmap);
var activeLayer = L.layerGroup().addTo(map);
var activeLayer = L.layerGroup().addTo(loopmap);

// L.tileLayer(TRANSIT_TILE).addTo(map);
// L.tileLayer(TRANSIT_TILE).addTo(loopmap);
// L.tileLayer('http://tile.thunderforest.com/transport/{z}/{x}/{y}.png').addTo(loopmap);

main();

function main() {
  drawStops();
  findStops();
  startPoll();
}

function findStops() {
  let dict = {};
  let counts = {};
  for(let line of lines) {
    dict[line.name] = {};
    counts[line.name] = 0;
  }

  for (let stop of stops) {
    let colors = getStopColors(stop);
    for(let color of colors) {
      if(stop.MAP_ID in dict[color]) {
        dict[color][stop.MAP_ID].stopIDs.push(stop.STOP_ID)
        dict[color][stop.MAP_ID].stops.push(getStop(stop.STOP_ID))
      } else {
        dict[color][stop.MAP_ID] = {
          station: getStation(stop.MAP_ID),
          line: getLine(color),
          color,
          stopIDs: [stop.STOP_ID],
          stops: [getStop(stop.STOP_ID)]
        }
      }
    }
  }

  let all = [];
  let j = 0;
  for(let color of Object.keys(dict)) {
    for (let mapID of Object.keys(dict[color])) {
      all.push({
        index: j,
        number: j + 1,
        color,
        id: mapID,
        on: false,
        stopIDs: dict[color][mapID].stopIDs,
        station: dict[color][mapID].station,
        line: dict[color][mapID].line
      });
      j++;
    }
  }

  for (let item of all) {
    counts[item.color]++;
  }

  allStations = all;

  findStationsForAllStops();
}

function findStationsForAllStops() {
  let d = {};
  for(let station of allStations) {
    for(let stopID of station.stopIDs) {
      if(stopID in d) {} else {
        d[stopID] = station.id;
      }
    }
  }
  stopToStationMap = d;
}

function determineState() {
  for (let i in allStations) {
    allStations[i].on = false;
  }

  for(let train of trains) {
    let lightID = stopToStationMap[train.nextStop];
    for(let i in allStations) {
      if(allStations[i].id == lightID
        && allStations[i].line.train == train.line) {
        allStations[i].on = true;
      }
    }
  }

  let lightsOn = 0;
  for(let station of allStations) {
    if(station.on) {
      lightsOn++;
    }
  }

  // console.log("train length: ", trains.length);
  // console.log("lightsOn: ", lightsOn);
  // console.log("allStations: ", allStations);

  document.getElementById("stations").innerHTML = stationsTemplate({
    stations: allStations, 
    trains: trains.length, 
    lights: lightsOn,
    version: version
  });
}

function getStopColors(stop) {
  let colors = []
  for(let line of lines) {
    if(stop[line.name]) {
      if(line.name == "Pexp") { // this step combines Pexp and P lines
        colors.push("P")
      } else {
        colors.push(line.name)
      }
    }
  }
  return colors;
}

function getLine(name) {
  for(let line of lines) {
    if(line.name == name) return line;
  }
}

function getStation(mapID) {
  for(let station of stations) {
    if(station.stop_id == mapID) return station;
  }
}

function getStop(stopID) {
  for(let stop of stops) {
    if(stop.STOP_ID == stopID) return stop;
  }
}

function startPoll() {
  httpGet(prefix + URL + suffix);
  setInterval(() => {
    httpGet(prefix + URL + suffix);
  }, pollTime)
}

function handleResponse(res) {
  // console.log("res: ", res);

  trains = [];
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

  activeLayer.clearLayers();

  for(let train of trains) {
    let stop = getStopById(train.nextStop);
    let line = getLineByColor(train.line);
    L.circleMarker(extractLocation(stop.Location), {
      radius: TRAIN_RADIUS,
      color: line.color + TRAIN_OPACITY
    }).addTo(map).addTo(activeLayer);
  }

  determineState();

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
        }).addTo(map).addTo(stationLayer);;
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



