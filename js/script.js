"use strict"
// TO-DO
// 1. add visual cue that pop-up is visible with button style
// 2. for multi pop up, make the x button individual (major issue) !!!!
// 3. Better thumbnail for play the pain
// 4. Divide artistic statement in 3 visual entities
// 5. In why hire, I can animate is not the right word...
// add interaction to title a boutet portfolio

// CONSTANTS
let CHECK_INTERVAL = 1;
let MOBILE_BREAKPOINT = 900;
let POP_MAX_WIDTH = 0.2; 
let POP_MAX_HEIGHT = 0.2; 
let WEST_PROPORTION = '40%';
let EAST_PROPORTION = '60%';
let POP_NARROW = '50%';
let POP_WIDE = '80%';
// VARIABLES
let jsonLoaded = false; 
let xbuttonID = 0; 
let mobile = false; 
// GLOBAL ARRAYS
let actions = []; 
let projects = []; 
// PROGRAM INITIATE
$(document).ready(preloadHome);
// Download JSON before calling setup
function preloadHome() {   
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
} // SETUP
function setupHome() {
    responsive();
    $( window ).on( "resize", responsive);
    p5setup();
    // determine the initial size of pop containers
    // create project POPs
    for (let i = 0; i < projects.length; i++) {
        let project = new ProjectHTML(projects[i]); // gather project content data
        let contentHTML = project.composeHTML(); // define HTML format for data in constructor
        managePop(projects[i].id, contentHTML, projects[i].barLabel,'auto', false, i);
    }
    // create action POPs
    for (let i = 0; i < actions.length; i++) {
        managePop(actions[i].id, actions[i].content, actions[i].barLabel, actions[i].height, actions[i].multi, i);
    }
} // use breakpoint for mobile layout vs desktop layout
function responsive() { 
    // desktop = eastsea 1/2 + westsea 1/2 --> eastworld 1/2 of eastsea + westworld 1/2 of westsea (quarters form)
    // mobile = eastsea 1/3 + westsea 2/3 --> eastworld 100% of eastsea + westworld 75% of westsea (thirds form)
    let screenWidth = $(window).width();
    console.log(screenWidth)
    $('#eastsea').css("width", EAST_PROPORTION);
    $('#eastsea').css("left", WEST_PROPORTION);
    $('#eastland').css("width", "100%");
    $('#westsea').css("width", WEST_PROPORTION);
    $('#westland').css("width", "100%");
    if (screenWidth < MOBILE_BREAKPOINT) { // if smaller than 
        mobile = true;
        popSize(); // adjust size of pop containers
        $('html').css("font-size", "18px"); // change the default to grow all font size (set at 16px for desktop)
        console.log('mobile');
    } else { // largen then
        mobile = false;
        popSize(); // adjust size of pop containers
        $('html').css("font-size", "16px"); // change to default
        console.log('desktop');
    }
} 
function popSize() {
    if (mobile) {   
        $('.container-pop').css("width", POP_WIDE); // all pop are 50%
    } else {
        $('.container-pop').css("width", POP_NARROW); // all pop are 50%
        $('#cvPOP1').css("width", POP_WIDE); // exception
        $('#cvPOP0').css("width", POP_WIDE); // exception
        $('#statementPOP').css("width", POP_WIDE); // exception
    }
}// convert object into single string
function dataToString(dataObject) {
    let HTMLstring = '';
    for (let i in dataObject) {
        HTMLstring += dataObject[i];
    }
    return HTMLstring; 
} // check if the id is already a children to avoid doubles
function checkIfChildren(popID) {
    for (let children of $('#eastland').children()) { // iterate through children
        if (children.id === popID) { // check if id already existing
            return true; // if yes, return true
        }
    }
} // return a string for a typical pop (bar, contentBox, exit button)
function createPOP(dataObject, barLabel) {
    let bar = `<div class="bar flex bg-accent text-main ff-primary-medium lowercase"><div>${barLabel}</div><button id="x${xbuttonID}" class="button-info-hide">X</button></div>`; // create bar at top
    xbuttonID ++; // make sure all exit button have unique id
    let openContent = '<div class="infoContent flex-column" style="">' // open the content div
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
function appendPOP(containerID, popID, dataObject, barLabel, height) {
    $(`#${containerID}`).append(`<div id='${popID}' class='container-pop bg-main text-accent'>${createPOP(dataObject, barLabel)}</div>`); // append pop-up
    popSize(); 
    // $(`#${popID}`).css({'width': width, 'height': height});
    let coordinates = randomCoordinates(containerID); // get random x,y in specific container
    $(`#${popID}`).css({'left': `${coordinates.x}px`, 'top': `${coordinates.y}px`}); // assign x,y to current POP
    $(`#${popID}`).draggable();
    closePOP(); // button to close all at once
} // create pop-up for action buttons
function managePop(buttonID, dataObject, barLabel, height, multi, index) {  
    let popID = buttonID + 'POP'; // create the ID of the future pop-up
    let toggle = false; // create toggle to manage display vs hidden
    $(`#${buttonID}`).on("click", () => { // on click
        if (!toggle) { // if hidden
            if (multi) { // if multiple pop container
                for (let i in actions[index].content) { 
                    appendPOP('eastland', popID+i, dataObject[i].subcontent, dataObject[i].label, height);
                }
            } else { // if single pop container
                appendPOP('eastland', popID, dataObject, barLabel, height); // append pop
            }
            toggle = true; // store as displayed
        } else if (toggle) { // if displayed
            if (multi) { // if multiple pop container
                for (let i in actions[index].content) { 
                    $(`#${popID+i}`).remove(); // remove pop
                    appendPOP('eastland', popID+i, dataObject[i].subcontent, dataObject[i].label, height);
                }
            } else { // if single pop container
                $(`#${popID}`).remove(); // remove pop
                appendPOP('eastland', popID, dataObject, barLabel, height); // append pop
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
            if ($('#eastland').children().length === 0) { // if no pop, hide the close all button
                $('#closePOP').hide()
            }
        });
        overlap(); 
    });
} // button to close all pop-up at once
function closePOP() {
    $('#closePOP').show();
    $('#closePOP').on('click', () => {
        $('.container-pop').remove(); 
        $('#closePOP').hide()
    });
} // if click on pop-up bring forward
function overlap() {
    $('.container-pop').on("click", function() {
        $(this).appendTo('#eastland');
    });
} // get random coordinates inside a container
function randomCoordinates(containerID) {
    let randomX = getRandomInt(0, specs(containerID).width * POP_MAX_WIDTH); // width set as 50%
    let randomY = getRandomInt(0, specs(containerID).height * POP_MAX_HEIGHT); // height set at 80%
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