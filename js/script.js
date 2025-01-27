"use strict"
// TO-DO
// 1. add visual cue that pop-up is visible with button style
// 2. for multi pop up, make the x button individual (minor issue)
// 3. Better thumbnail for play the pain
// 4. Divide artistic statement in 3 visual entities

let jsonLoaded = false; 
let CHECK_INTERVAL = 1;
let actions = []; 
let projects = []; 
let popQuadrantNarrow = {x:0.5, y:0.2};
let popQuadrantWide = {x:-0.1, y:0.2};
let xbuttonID = 0; 
 
let projectBarLabel = {
    part: 'pART',
    read: 'read.my.column',
    greenhouse: 'Greenhouse Machine',
    magnetic: 'Magnetic Bodies'
}

$(document).ready(preloadHome);
// 
function preloadHome() {
    console.log(jsonLoaded);        
    loadJSON('data/home_data.json'); // Get JSON file
    // loadJSON('data/project_data.json', projectOverviews);
    let loading = setInterval(() => { // Check if it has loaded at a set interval
        if (jsonLoaded) { // If everything is downloaded
            setupHome(); 
        clearInterval(loading); // Clear the interval
        }}, CHECK_INTERVAL)
} // Get data from JSON file, show error if fail, store data in global array if done
function loadJSON(file) {  
    $.getJSON(file) // Get the data from the JSON file
    .fail((request, textStatus, error) => { 
        console.error(error);}) // Display the error in the console
    .done((data) => { 
        actions = data.actions; // Store in an array
        projects = data.projects; // Store in an array
        jsonLoaded = true; // Update boolean
    });
}
function setupHome() {
    p5setup();
  
    // manage clicks toggle diplay, random coordinates, and superposition (delete every time)
    for (let i = 0; i < projects.length; i++) {
        managePop(projects[i].id, projects[i].content, projects[i].barLabel, '50%', 'auto', 'narrow', false, i);
        console.log('hey')
    }
    // create 4 POPs 
    // create action POPs
    for (let i = 0; i < actions.length; i++) {
        managePop(actions[i].id, actions[i].content, actions[i].barLabel, actions[i].width, actions[i].height, actions[i].quadrant, actions[i].multi, i);
    }
} 
function dataToString(dataObject) {
    let HTMLstring = '';
    for (let i in dataObject) {
        HTMLstring += dataObject[i];
    }
    return HTMLstring; 
} // manages the toggle of when to append or move or remove project preview pop-up
function manageProjectPreview() {
    let generalWidth = '50%';
    let generalHeight = 'auto';  
    $('.project-list-button').on("click", (e) => { // CREATE A TOGGLE TO ADD INFO BUBBLE AND HIDE THEM, THEY ALWAYS APPEAR ON TOP OF THE OTHER
        let popID = e.currentTarget.id + 'Project'; // store the bubble ID
        let barLabel = projectBarLabel[`${e.currentTarget.id}`]; // Create the bar label from array 
       if ($('#eastland').children().length === 0) { // if eastland is empty add 1 by default
            appendPOP('eastland', popID, project, barLabel, generalWidth, generalHeight, popQuadrantNarrow); // append pop-up
       } else if (checkIfChildren(popID)) { // if it exist already
           $(`#${popID}`).remove(); // remove
           appendPOP('eastland', popID, project, barLabel, generalWidth, generalHeight, popQuadrantNarrow); // append pop-up
       } else { // if it does not exist
            appendPOP('eastland', popID, project, barLabel, generalWidth, generalHeight, popQuadrantNarrow); // create
       } $('.button-info-hide').on("click", () => { // remove the pop-up with x button
           $(`#${popID}`).remove();
       });
       overlap();
   });    
} // check if the id is already a children to avoid doubles
function checkIfChildren(popID) {
    for (let children of $('#eastland').children()) { // iterate through children
        if (children.id === popID) { // check if id already existing
            return true; // if yes, return true
        }
    }
} // return a string for a typical pop (bar, contentBox, exit button)
function createPOP(dataObject, barLabel) {
    let bar = `<div class="bar"><div>${barLabel}</div><button id="x${xbuttonID}" class="button-info-hide">X</button></div>`; // create bar at top
    xbuttonID ++; // make sure all exit button have unique id
    console.log(xbuttonID)
    let openContent = '<div class="infoContent">' // open the content div
    let popContent = dataToString(dataObject); // full content passed through data
    let closeContent = '</div>'; // close the content div
    let compiller = []; // array to compile
    compiller.push(bar, openContent, popContent, closeContent); // push everything in 
    let HTMLtext = ''; // create variable to store full string
    for (let i in compiller) { // turn into single string
        HTMLtext += compiller[i];
    }
    return HTMLtext; // return the string that contains HTML code
} // append pop-up to container and choose ID
function appendPOP(containerID, popID, dataObject, barLabel, width, height, quadrant) {
    $(`#${containerID}`).append(`<div id='${popID}' class='pop'>${createPOP(dataObject, barLabel)}</div>`); // append pop-up
    $(`#${popID}`).css({'width': width, 'height': height});
    let coordinates = randomCoordinates(containerID, quadrant.x, quadrant.y); // get random x,y in specific container
    $(`#${popID}`).css({'left': `${coordinates.x}px`, 'top': `${coordinates.y}px`}); // assign x,y to current POP
    $(`#${popID}`).draggable()
    closePOP(); // button to close all at once
} // create pop-up for action buttons
function managePop(buttonID, dataObject, barLabel, width, height, quadrant, multi, index) {  
    let popID = buttonID + 'POP'; // create the ID of the future pop-up
    let toggle = false; // create toggle to manage display vs hidden
    let thisQuadrant = ''; //transpose the string from JSON to local variable
    if (quadrant == "wide") {
        thisQuadrant = popQuadrantWide;
    } else if (quadrant == "narrow") {
        thisQuadrant = popQuadrantNarrow;
    }
    $(`#${buttonID}`).on("click", () => { // on click
        if (!toggle) { // if hidden
            if (multi) { // if multiple pop container
                for (let i in actions[index].content) { 
                    appendPOP('eastland', popID+i, dataObject[i].subcontent, dataObject[i].label, width, height, thisQuadrant);
                }
            } else { // if single pop container
                appendPOP('eastland', popID, dataObject, barLabel, width, height, thisQuadrant); // append pop
            }
            toggle = true; // store as displayed
        } else if (toggle) { // if displayed
            if (multi) { // if multiple pop container
                for (let i in actions[index].content) { 
                    $(`#${popID+i}`).remove(); // remove pop
                    appendPOP('eastland', popID+i, dataObject[i].subcontent, dataObject[i].label, width, height, thisQuadrant);
                }
            } else { // if single pop container
                $(`#${popID}`).remove(); // remove pop
                appendPOP('eastland', popID, dataObject, barLabel, width, height, thisQuadrant); // append pop
            }
        } // exit button hides 
        $('.button-info-hide').on("click", () => { // remove the pop-up with x button
            if (multi) { // if multiple pop container
                for (let i in actions[index].content) { 
                    $(`#${popID+i}`).remove(); // remove pops
                }
            } else { // if single pop container
                $(`#${popID}`).remove(); // remove pop
            }
        });
        overlap(); 
    });
} // button to close all pop-up at once
function closePOP() {
    $('#closePOP').show();
    $('#closePOP').on('click', () => {
        $('.pop').remove(); 
        $('#closePOP').hide()
    });
} // if click on pop-up bring forward
function overlap() {
    $('.pop').on("click", function() {
        $(this).appendTo('#eastland');
    });
} // get random coordinates inside a container
function randomCoordinates(containerID, popWidth, popHeight) {
    let randomX = getRandomInt(0, specs(containerID).width * popWidth); // width set as 50%
    let randomY = getRandomInt(0, specs(containerID).height * popHeight); // height set at 80%
    let coordinates = {
        x: randomX,
        y: randomY    }
    return coordinates; 
} // get random interger
function getRandomInt(min, max) {
    let minCeiled = Math.ceil(min);
    let maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
} // get the bounding client rects of object from id
function specs(id) {
    let elem = document.getElementById(id);
    let rect = elem.getBoundingClientRect();
    return rect; 
}