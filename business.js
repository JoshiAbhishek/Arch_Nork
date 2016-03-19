'use strict';

var data = require('./data.js');
var world = data.World;

//Initialize beginning state of Nork game
function init() {
    console.log("****************************");
    
    console.log(world.welcome + "\n");
    console.log(world.description + "\n");
    console.log("Now to the first location!");
    
    console.log("****************************");

    return findLocation(world.startLocation);
}

//Search for a location by its ID
function findLocation(locationID) {
    if (world.rooms.length < 1) {
        console.log("Error: No locations");
    }
    else {
        for (var i = 0; i < world.rooms.length; i++) {
            if (world.rooms[i].id === locationID) {
                return world.rooms[i];
            }
        }
    }
    
    return undefined;
}

//Validate if the item exists at the current location
function validateItem(currentLocation, item) {
    if (currentLocation.items !== undefined && currentLocation.items !== "") {
        for (var i = 0; i < currentLocation.items.length; i++) {
            if (currentLocation.items[i] === item) {
                return true;
            }
        }
    }

    return false;
}

//Validate if the item is usable at the current location
function validateUse(currentLocation, item) {
    if (currentLocation.uses !== undefined && currentLocation.uses !== "") {
        for (var i = 0; i < currentLocation.uses.length; i++) {
            if (currentLocation.uses[i].item === item) {
                return currentLocation.uses[i]
            }
        }
    }

    return undefined;
}

module.exports.init = init;
module.exports.findLocation = findLocation;
module.exports.validateItem = validateItem;
module.exports.validateUse = validateUse;