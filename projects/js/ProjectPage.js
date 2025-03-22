class ProjectPage {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.year = data.year;
        this.medium = data.medium;
        this.context = data.context;
        this.abstract = data.abstract;
        this.tools = data.tools;
        this.goals = data.goals;
        this.body = data.body; // large array
        this.sectionsArr = [];
        this.arrow = {l: '🡠', r: '🡢', u: '🡡', d: '🡣', ul: '🡤', ur: '🡥', dr: '🡦', dl: '🡧'}
        this.specs = function (parent) { // function for the left section of project pages
            let toolList = ''; // for lists join before
                for (let i in this.tools) {
                    toolList += '■ ' + this.tools[i];
                    toolList += '<br>';
                } let goalList = '';// for lists join before
                for (let i in this.goals) {
                    goalList += '■ ' + this.goals[i];
                    goalList += '<br>';
                } let specs = {  // assemble all the component of the specs section
                container: '<div id="westWorld" class="flex-column">',
                title: `<h1 class="bold ff-decorative fs-900">${this.title}</h1>`,
                medium: `<h4 class="">${this.medium}</h4>`,
                year: `<p><span class="bold fs-600">year<br></span>${this.year}</p>`,
                abstract: `<p><span class="bold fs-600">abstract<br></span>${this.abstract}</p>`,
                goals: `<p><span class="bold fs-600">learning goals<br></span>${goalList}</p>`,
                context: `<p><span class="bold fs-600">context<br></span>${this.context}</p>`,
                tools: `<p><span class="bold fs-600">tools<br></span><span class="tool">${toolList}</span></p>`,
                containerEnd: '</div>'
            } // Turn into a single string
            let HTMLstring = dataToString(specs); 
            $(`#${parent}`).append(HTMLstring); // append to parent container
        };
        this.sections = function (parent) { // function to create the sections of the body
            for (let i in this.body) { // for all sections create the box and its content
                let section = { // assemble all components
                    container: `<div id="section${i}" class="section">`,
                    box: `<div id="sectionHeader${i}" class="sectionHeader" data-active='false'>`,
                    title: `<div id="section-prev-txt${i}" class="section-prev-txt fs-500" style="margin-inline: var(--section-marg-inline)"><span class="arrow">${this.arrow.r}</span> ${this.body[i].section}</div>`,
                    wordCount: `<div id="word${i}" class="wordCount section-prev-txt italic" style="margin-inline: var(--section-marg-inline)">${this.body[i].wordCount} words</div>`,
                    boxEnd: '</div>',
                    containerEnd: `</div>`
                } // Turn into a single string
                let HTMLstring = dataToString(section); 
                $(`#${parent}`).append(HTMLstring); // append to parent container
                //  make an array that will be useful in all scripts
                this.sectionsArr.push({index: i, id: 'section' + i, short: section.box + section.title + section.wordCount + section.boxEnd, long: this.body[i].content, open: false});
            }
        };
        this.formatSection = function(sectionIndex) { // function to adjust the display depending on the text type from JSON file
            let compiller = [];
            let proj = this.body[sectionIndex].content;
            console.log(proj)
            for (let i in proj) {
                let string = '';
                if (proj[i].type === 'p') { // PARAGRAPH 
                    string = `<p>${proj[i].text}</p>`
                } else if (proj[i].type === 'ss-tit') { // SOUS-TITRE
                    string = `<p class='fs-700 ${proj[i].type}'>${proj[i].text}</p>`
                } else if (proj[i].type === 'ss-ss-tit') { // SOUS-TITRE
                    string = `<p class='fs-400 ${proj[i].type}'>${proj[i].text}</p>`
                } else if (proj[i].type === 'img') { // IMG
                    string = `<div id="image${i}" class="image flex-column" style="width:${proj[i].size}">
                    <img src="${proj[i].href}" width="100%">
                    <span id="caption${i}" class="caption fs-300">${proj[i].text}</span></div>`
                } else if (proj[i].type === 'cards') { // CARDS
                    for (let ii in proj[i].text) {
                        let temp = `<p class='fs-500 card-label' style='padding: 0.5em'>${proj[i].text[ii].header}</p>`;
                        temp += `<div>${proj[i].text[ii].image}</div>`;
                        temp += `<p>${proj[i].text[ii].body}</p>`;
                        string += `<div class='card-item'  style='width:${proj[i].size}'>${temp}</div>`;
                    }
                    string = `<div class='flex cards'>${string}</div>`;
                } else if (proj[i].type === 'ol-large') { // ORDERED LIST LARGE NUMBERS
                    for (let ii in proj[i].text) {
                        string += `<p>${proj[i].text[ii]}</p>`
                    }
                    string = `<div class="${proj[i].type}">`+string+'</div>';
                } else if (proj[i].type === 'grid') { // GRID
                    for (let ii in proj[i].text) {
                        let temp = ''; 
                        for (let iii in proj[i].text[ii]) {
                            temp += `<div>${proj[i].text[ii][iii]}</div>`;
                        }
                        string += temp;
                    }
                    string = `<div class="${proj[i].type}" style='grid-template-columns:${proj[i].col}'>`+string+'</div>';
                } else if (proj[i].type === 'flow-chart') { // FLOW-CHART
                    for (let ii in proj[i].text) {
                        if (ii < proj[i].text.length -1) {
                            string += `<div class='island'><p class="flow-chart-header">${proj[i].text[ii].header}</p><p>${proj[i].text[ii].body}</p></div><div class=" flex flow-line"><div class="flow-line-top"></div><div></div></div>`;
                        } else {
                            string += `<div class='island'><p class="flow-chart-header">${proj[i].text[ii].header}</p><p>${proj[i].text[ii].body}</p></div>`;
                        }
                    }
                    string = `<div class="flex ${proj[i].type}">`+string+'</div>';
                } else if (proj[i].type === 'ref') { // BIBLIOGRAPHY REF
                    string = `<p class="${proj[i].type}">${proj[i].text}</p>`;
                } else if (proj[i].type === 'gallery') { // IMAGE GALLERY
                    let temp = '';
                    for (let ii in proj[i].images) {
                        temp += `<div id="image-gal${ii}" class="image-gal gallery-item flex-column" style="width:${proj[i].size};">
                        <img src="${proj[i].images[ii].href}" width="100%">
                        <span id="caption-gal${ii}" class="caption caption-gal fs-300">${proj[i].images[ii].caption}</span></div>`;
                    }
                    console.log(proj[i].wrap)
                    string = `<div class='gallery-label'>${proj[i].text}</div><div class='gallery' style="flex-wrap: ${proj[i].wrap}">${temp}</div>`;
                }                                                                            
                compiller.push(string);
            }
            let HTMLstring = dataToString(compiller);
            // HTMLstring += '<button>minimize section</button>';
            return HTMLstring;
        }
    }
}
