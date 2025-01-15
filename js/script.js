"use strict"
// TO-DO
// 1. add visual cue that pop-up is visible with button style

$(document).ready(setup);

function setup() {
    // manage clicks toggle diplay, random coordinates, and superposition (delete every time)
    manageProjectPreview();
    // create 4 popups 
    // create action popups

} 
function manageProjectPreview() {
    $('.project-list-button').click((e) => { // CREATE A TOGGLE TO ADD INFO BUBBLE AND HIDE THEM, THEY ALWAYS APPEAR ON TOP OF THE OTHER
        let bubbleID = e.currentTarget.id + 'Bubble'; // store the bubble ID 
       if ($('#eastland').children().length === 0) { // if eastland is empty add 1 by default
           infoPopUpCreate('eastland', bubbleID); // append pop-up
       } else if (checkIfChildren(bubbleID)) { // if it exist already
           $(`#${bubbleID}`).remove(); // remove
        //    infoPopUpCreate('eastland', bubbleID); // append pop-up
       } else { // if it does not exist
           infoPopUpCreate('eastland', bubbleID); // create
       } $('.button-info-hide').on("click", () => { // remove the pop-up with x button
           $(`#${bubbleID}`).remove();
       });
   });    
} // check if the id is already a children to avoid doubles
function checkIfChildren(bubbleID) {
    for (let children of $('#eastland').children()) { // iterate through children
        if (children.id === bubbleID) { // check if id already existing
            return true; // if yes, return true
        }
    }
} // create the info pop-up container
function infoPopUpCreate(containerID, bubbleID) {
    $('#eastland').append(`<div id='${bubbleID}'class='infoPop'>${infoPopUpContent(bubbleID)}</div>`); // append pop-up
    let coordinates = randomCoordinates(containerID); // get random x,y in specific container
    $(`#${bubbleID}`).css({'left': `${coordinates.x}px`, 'top': `${coordinates.y}px`}); // assign x,y to current popUp
} // assemble the content for the pop-up container
function infoPopUpContent(title) {
    let bar = '<div class="bar"><div>My best POPUP</div><button class="button-info-hide">X</button></div>';
    let project = {
        openDIV: '<div class="infoContent">',
        thumbnail : '<img class="thumbnail" src="assets/images/test.png">',
        title : `<p>${title}</p>`,
        year : '<p>2032</p>',
        medium : '<p>sweat, blood, and efforts</p>',
        summary : '<p>pARt combines art and technology; it is a mobile application prototype that enables local artists to publish their art digitally in any public location. App users may then admire these artworks with augmented reality technologies.</p>',
        
        button : '<button class="CTA">clickme</button>',
        closeDIV: '</div>'
    }  
    let HTMLtext = bar;
    for (let i in project) {
        HTMLtext += project[i];
    }
    // console.log(HTMLtext);
    return HTMLtext;
} // get random coordinates inside a container
function randomCoordinates(containerID) {
    let randomX = getRandomInt(0, specs(containerID).width/2); // width set as 50%
    let randomY = getRandomInt(0, specs(containerID).height * 0.2); // height set at 80%
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