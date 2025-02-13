/* 
TO DO 
- change the arrow when a section is open
- on section hover show a background image  


*/



"use strict"

let CHECK_INTERVAL = 1;

let project = '';
let projects = []; 
let jsonLoaded = false; 

$(document).ready(preloadProject);

function preloadProject() {   
    loadJSON('/data/project_data.json'); // Get JSON file
    // loadJSON('data/project_data.json', projectOverviews);
    let loading = setInterval(() => { // Check if it has loaded at a set interval
        if (jsonLoaded) { // If everything is downloaded
            setupProject(); 
        clearInterval(loading); // Clear the interval
        }}, CHECK_INTERVAL)
} // Get data from JSON file, show error if fail, store data in global array if done
function loadJSON(file) {  
    $.getJSON(file) // Get the data from the JSON file
    .fail((request, textStatus, error) => { 
        console.error(error);}) // Display the error in the console
    .done((data) => { 
        projects = data.projects; // Store in an array
        jsonLoaded = true; // Update boolean
    });
}
function setupProject() {
    project = new ProjectPage(projects[0]); // create project
    project.specs('westland'); // specs section left
    project.sections('eastContinent'); // content sections on left
    toggleView();
}
function toggleView() { 
    $('.sectionHeader').on('click', function() {
        let thisButton = $(this).attr('id'); // get id
        let thisIndex = thisButton.replace("sectionHeader", ""); // get index
        let thisSection =  "section" + thisIndex;  // create id of section
        let thisWordCount = 'word' + thisIndex; 
        let close = function() {
            $(`#${thisButton}`).removeClass('section-active');
            $(`#${thisSection}`).removeClass('adapt');
            $(`#${thisSection}Long`).remove();
            $(`#${thisWordCount}`).show();
            $(`#navButton${thisIndex}`).remove();
            project.sectionsArr[thisIndex].open = false;
        }
        let open = function() {

            $(`#${thisButton}`).addClass('section-active');
            $(`#${thisSection}`).addClass('adapt'); // add a class to elongate the box
            $(`#${thisSection}`).append(`<div id="${thisSection}Long" class="longView">${project.formatSection(thisIndex)}</div><button id='navButton${thisIndex}' class='navButton'>minimize section</button>`); // add the content
            $(`#${thisWordCount}`).hide();
            project.sectionsArr[thisIndex].open = true; // 
            imgCaption();   
        }
        if (!project.sectionsArr[thisIndex].open) { // if closed
            open();
        } else {
            close();
        }
        $(`#navButton${thisIndex}`).on('click', function() {
            close();
        })
    });
}
function imgCaption() { 
    $('.caption').hide(); 
    $('img').on('mouseenter', function() {
        $('.caption').show(); 
    }).on('mouseleave', function() {
        $('.caption').hide(); 
    });
}
function dataToString(dataObject) {
    let HTMLstring = '';
    for (let i in dataObject) {
        HTMLstring += dataObject[i];
    }
    return HTMLstring; 
}

