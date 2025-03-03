/* 
TO DO 
- find howw to signal that there is more to read in the specs section (west) gradient? animation? arrows?
- add the name of the next and previous projects on hover
- scroll bar???
- in mobile view have the center be a two button situation two expand one or the other section for better view
*/
"use strict"
// constants
let CHECK_INTERVAL = 1;
let MOBILE_BREAKPOINT = 900;
let MOBILE_PROPORTION = .4; // proportion of the first part
let DESKTOP_PROPORTION = .3;
// variables
let project = '';
let projects = []; 
let jsonLoaded = false; 
let pages = [];
let thisProjectName = "";
let thisProjectIndex = 0;
let mobile = false; 
// start the program
$(document).ready(preloadProject);
// Download JSON before calling setup
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
} // Setup 
function setupProject() {
    findMe(); // display the right project
    project = new ProjectPage(projects[thisProjectIndex]); // create project
    project.specs('west'); // specs section left
    project.sections('eastIslands'); // content sections on left
    toggleView(); // allow clicks on section to view content
    navPages(); // Move seamlessly from one page to the other in order
    responsive();
    sectionHover();
    $( window ).on( "resize", responsive);
} // Find the correct JSON data from html data value in #world so its can be used for all pages
function findMe() {
    for (let i = 0; i < projects.length; i++) { // create an array of all the projects
        pages.push({"name": projects[i].id, "url": projects[i].href, "order": i})
    } // store the id 
    thisProjectName = $('#world').data('page');
    for (let i = 0; i < pages.length; i++) { // use the id to find its index (the order is the same in the JSON file)
        if (pages[i].name === thisProjectName) {
            thisProjectIndex = i; 
        }
    }
} // Change the view of the sections to show content
function toggleView() { 
    $('.sectionHeader').on('click', function() {
        let thisButton = $(this).attr('id'); // get id
        let thisIndex = thisButton.replace("sectionHeader", ""); // get index
        let thisSection =  "section" + thisIndex;  // create id of section
        let thisWordCount = 'word' + thisIndex; 
        let thisPrevTxt = 'section-prev-txt'+ thisIndex;
        let close = function() {
            $(`#${thisButton}`).removeClass('section-active');
            $(`#${thisButton}`).data('active', false);
            $(`#${thisSection}`).removeClass('adapt');
            $(`#${thisSection}Long`).remove();
            $(`#${thisWordCount}`).show();
            $(`#navButton${thisIndex}`).remove();
            $(`#${thisPrevTxt}>span`).text(project.arrow.r);
            project.sectionsArr[thisIndex].open = false;
        }
        let open = function() {
            $(`#${thisButton}`).addClass('section-active');
            $(`#${thisButton}`).data('active', true);
            $(`#${thisSection}`).addClass('adapt'); // add a class to elongate the box
            $(`#${thisSection}`).append(`<div id="${thisSection}Long" class="longView">${project.formatSection(thisIndex)}</div><button id='navButton${thisIndex}' class='navButton'>minimize section</button>`); // add the content
            $(`#${thisWordCount}`).hide();
            $(`#${thisPrevTxt}>span`).text(project.arrow.d);
            project.sectionsArr[thisIndex].open = true; // 
            imgCaption(thisIndex);   
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
} // Manage the caption of images
function imgCaption(parentIndex) { 
    let uniqueIDimg = 0; 
    $('.image, .image-gal').each(function(){ // create a unique id for each picture
        let thisIMG = $(this).attr('id');
        console.log(thisIMG)
        $(this).attr('id', `${thisIMG}-${uniqueIDimg}-${parentIndex}`)
        uniqueIDimg ++;
    });
    let uniqueIDcap = 0; 
    $('.caption, .caption-gal').each(function(){ // create a unique id for each caption
        let thisCaption= $(this).attr('id');
        $(this).attr('id', `${thisCaption}-${uniqueIDcap}-${parentIndex}`)
        uniqueIDcap ++;
    });
    if (!mobile) {
        $('.caption, .caption-gal').hide();
    } else {
        $('.caption, .caption-gal').show();
    }
    $('.image').on('mouseenter', function() {
        let thisIMG = $(this).attr('id'); // get id
        console.log(thisIMG)
        let thisIndex = thisIMG.replace("image", ""); // get index
        console.log(thisIndex)
        $(`#caption${thisIndex}`).show(); 
    }).on('mouseleave', function() {
        $('.caption').hide(); 
    });
    $('.image-gal').on('mouseenter', function() {
        let thisIMG = $(this).attr('id'); // get id
        let thisIndex = thisIMG.replace("image-gal", ""); // get index
        console.log(thisIndex)
        $(`#caption-gal${thisIndex}`).show(); 
    }).on('mouseleave', function() {
        $('.caption').hide(); 
    })
} // Turn an array object into a single string
function dataToString(dataObject) {
    let HTMLstring = '';
    for (let i in dataObject) {
        HTMLstring += dataObject[i];
    }
    return HTMLstring; 
} // Change from one page to the other in linear fashion
function navPages() { // !!!!!!!!!!!!!!!!!!!! check if disable works okay once the other pages are good
    if (thisProjectIndex === 0) { // if first
        $("#previous").prop("disabled", true).css("opacity", 0.2); // disable button and hide
    } else if (thisProjectIndex === pages.length) { // if last
        $("#next").prop("disabled", true).css("opacity", 0.2); // disable button and hide
    } else { // if in between
        $("#previous, #next").prop("disabled", false).css("opacity", 1); // enable buttons
        // $("#next").prop("disabled", false);
        $("#previous").on("click", function() {
            window.location.replace(pages[thisProjectIndex-1].url);
        });
        $("#next").on("click", function() {
            window.location.replace(pages[thisProjectIndex+1].url);
        });
        $("#home").on("click", function() {
            window.location.replace("/index.html");
        });
    }
} // Manage the layout according to screen size
function responsive() {
    let screenWidth = $(window).width();
    console.log(screenWidth)
    if (screenWidth < MOBILE_BREAKPOINT) { // if smaller than 
        mobile = true;
        // $('html').css("font-size", "16px"); // change the default to grow all font size (set at 16px for desktop)
        console.log('mobile');
        $("#west").css({
            'width': '100%',
            'height': `${100*MOBILE_PROPORTION}%`,
            'border-bottom': 'var(--border-w) solid var(--clr-main)'
        });
        $("#westWorld>h1").css('font-size','var(--fs-800)');
        $("#east").css({
            'width': '100%',
            'height': `${100*(1-MOBILE_PROPORTION)}%`,
            'top': `${100*MOBILE_PROPORTION}%`,
            'left': 0
        })
        $("#eastIslands").css('padding-inline-end', 'var(--pad-marg-xl)');
    } else { // largen then
        mobile = false;
        // $('html').css("font-size", "16px"); // change to default
        console.log('desktop');
        $("#west").css({
            'width': `${100*DESKTOP_PROPORTION}%`,
            'height': '100%'
        });
        $("#westWorld>h1").css('font-size','var(--fs-900)');
        $("#east").css({
            'width': `${100*(1-DESKTOP_PROPORTION)}%`,
            'height': '100%',
            'top': '0',
            'left': `${100*DESKTOP_PROPORTION}%`,
        });
        $("#eastIslands").css('padding-inline-end', 'var(--pad-marg-jumbo)');
    }
} // On hover make the section background an image  
function sectionHover() {
    $('.sectionHeader').on('mouseenter',function() {
        let thisIndex = $(this).attr('id').replace("sectionHeader", ""); // get index
        if (!$(this).data('active')) { // check if open HTML data
            if (projects[thisProjectIndex].body[thisIndex].background === "") {
                $(this).css({"background-color": "var(--clr-unique-accent)"});
            } else {
                $(this).css({'background-image':`url('${projects[thisProjectIndex].body[thisIndex].background}')`,"background-position": "center", "background-size": "cover"}); // use image as background on hover
            }
            $(this).children().addClass('invincibleTXT');
        }   
    }).on('mouseleave', function() { // return to default
        $(this).css('background', 'var(--clr-secondary)');
        $(this).children().removeClass('invincibleTXT');
        
             
    });
}
