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
    console.log(project.sectionsArr)
}
function toggleView() {
    // console.log(project.sectionsArr);
    $('.section').on('click', function() {
        // console.log($(this).attr('id'));
        let thisSection = $(this).attr('id'); // get id
        let thisIndex = thisSection.replace("section", ""); // get index
        if (project.sectionsArr[thisIndex].open) { // if close
            $(`#${thisSection}`).addClass('adapt');
            $(`#${thisSection}`).html(project.formatSection(thisIndex));
            project.sectionsArr[thisIndex].open = false;
        } else { // if open
            $(`#${thisSection}`).removeClass('adapt');
            $(`#${thisSection}`).html(project.sectionsArr[thisIndex].short);
            project.sectionsArr[thisIndex].open = true;
            console.log('long');
        }
    });
}
function dataToString(dataObject) {
    let HTMLstring = '';
    for (let i in dataObject) {
        HTMLstring += dataObject[i];
    }
    return HTMLstring; 
}

