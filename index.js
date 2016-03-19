'use strict';

var readline = require('readline');
var business = require('./business.js');

var io = readline.createInterface({ //call the interface "io"
    input: process.stdin, //input comes from the terminal ("standard in")
    output: process.stdout //output goes to the terminal ("standard out")
});

var inventory = []; //Holds the current inventory of items the user has
var currentLocation; //Specifies the user's current location in the game
var currentMoves = 0; //Current number of moves (places gone)
var moves = 6; //Max number of moves (place gone)

game();

function game() {
    currentLocation = business.init();

    if (currentLocation === undefined) {
        console.log("Unexpected error initializing");
    }
    else {
        location();
    }
}

//Display location information
function location() {
    if (currentLocation == null) {
        console.log("Unexpected error: location not found");
    }
    else {
        console.log("\n" + "----------------");
        console.log("\n" + ((currentLocation.id).toUpperCase()) + "\n");
        console.log("----------------" + "\n");

        console.log(currentLocation.description + "\n");

        if (currentLocation.id === "won") {
            reset();
        }

        if (currentLocation.items != null && currentLocation.items != "") {
            console.log("Looks like you can take " + currentLocation.items + " to use.");
        }

        if (currentMoves === moves) {

            console.log("\n" + "****************************");

            console.log("LOSE");
            console.log("\n" + "Max number of moves reached" + "\n");

            console.log("****************************" + "\n");

            lose();
        }

        action();
    }
}

//Allows the user to take an action
function action() {
    console.log("\n" + currentMoves + " moves out of " + moves + " used " + "\n");

    var prompt = "\n" + "> You are in " + currentLocation.id + ". What do you want to do?" + "\n";

    io.question(prompt, function (answer) {
        var arr = answer.split(" ");

        if (arr.length > 2) {
            console.log("Error: Please enter an action correctly." + "\n");
            action();
        }
        else {
            if (arr.length === 2) {
                var target = arr[1].toLowerCase();
            }

            switch (arr[0].toUpperCase()) {
                //If a valid direction is given with the GO command, find that location and then go to it
                case "GO":
                    if (currentLocation.exits[target] !== undefined && currentLocation.exits[target] !== "") {
                        currentMoves++;

                        currentLocation = business.findLocation(currentLocation.exits[target].id);
                        location();
                    }
                    else {
                        console.log("That direction is not available for this room.");
                        action();
                    }
                    break;
                
                //If a valid item is given with the TAKE command, add it to the inventory    
                case "TAKE":
                    if (validateItem(target)) {

                        inventory.push(target);
                        console.log("You added " + target + " to your inventory.");
                    }
                    else {
                        console.log("You cannot take that item.");
                    }

                    action();

                    break;

                //If a valid usable item is given with the USE command, use it and implement its effect    
                case "USE":
                    if (findItem(target)) {
                        var use = validateUse(target);

                        if (use !== undefined) {
                            console.log("You used " + use.item + ". " + "\n");
                            console.log(use.description + "\n");

                            if (use.effect.goto !== undefined || use.effect.goto !== "") {
                                currentLocation = business.findLocation(use.effect.goto.id);
                                location();
                            }
                            else {
                                console.log("\n" + "Unexpected error: No go to effect for item use" + "\n");
                            }
                        }
                        else {
                            //lose();
                            console.log("Nothing to use here.");
                            action();
                        }

                    }
                    else {
                        //lose();
                        console.log("Item not here.");
                        action();
                    }

                    break;
                
                //Return the inventory of items with the INVENTORY command
                case "INVENTORY":
                    console.log("\n" + inventory + "\n");
                    action();

                    break;
                
                //Default case if an incorrect action is given
                default:
                    console.log("Incorrect action" + "\n");

                    action();

            } //end switch case
        } //end else statement       
    });


} //end action function
    
//Display loss message and reset the game
function lose() {
    //console.log("That is the wrong item. You got eaten by a grue.");
    reset();
}

//Validate if the item exists at the current location
function validateItem(item) {
    return business.validateItem(currentLocation, item);
}

//Validate if the item is usable at the current location
function validateUse(item) {
    return business.validateUse(currentLocation, item);
}

//Find the item in the inventory
function findItem(item) {
    for (var i = 0; i < inventory.length; i++) {
        if (inventory[i] == item) {
            return true;
        }
    }

    return false;
}

//Reset the game
function reset() {
    currentLocation = null;
    inventory = [];
    currentMoves = 0;

    game();
    //io.close();
}