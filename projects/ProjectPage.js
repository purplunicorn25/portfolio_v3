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
                title: `<h1 class="bold fs-700">${this.title}</h1>`,
                medium: `<h4 class="">${this.medium}</h4>`,
                abstract: `<p><span class="bold">abstract<br></span>${this.abstract}</p>`,
                year: `<p><span class="bold">year<br></span>${this.year}</p>`,
                tools: `<p><span class="bold">tools<br></span><span class="tool"${toolList}</span></p>`,
                goals: `<p><span class="bold">learning goals<br></span>${goalList}</p>`,
                containerEnd: '</div>'
            } // Turn into a single string
            let HTMLstring = dataToString(specs); 
            $(`#${parent}`).append(HTMLstring); // append to parent container
        };
        this.sections = function (parent) { // function to create the sections of the body
            for (let i in this.body) { // for all sections create the box and its content
                let section = { // assemble all components
                    container: `<div id="section${i}" class="section">`,
                    box: `<div id="sectionHeader${i}" class="sectionHeader">`,
                    title: `<div id="section-prev-txt${i}" class="section-prev-txt fs-500" style="margin-inline: var(--section-marg-inline)"><span class="fs-600">${this.arrow.r}</span> ${this.body[i].section}</div>`,
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
                if (proj[i].type === 'p') {
                    string = `<p>${proj[i].text}</p>`
                } else if (proj[i].type === 'ss-tit') {
                    string = `<p class='fs-800 ${proj[i].type}'>${proj[i].text}</p>`
                } else if (proj[i].type === 'img') {
                    string = `<div class="image" style="width:${proj[i].size}"><img id="img${i}"src="${proj[i].href}" width="100%"><span id="caption${i}" class="caption fs-200">${proj[i].text}</span></div>`
                } else if (proj[i].type === 'cards') {
                    for (let ii in proj[i].text) {
                        let temp = `<p class='fs-400 bg-main' style='padding: 0.5em'>${proj[i].text[ii].header}</p>`;
                        temp += proj[i].text[ii].image;
                        temp += `<p>${proj[i].text[ii].body}</p>`;
                        string += `<div>${temp}</div>`;
                    }
                    string = `<div class='flex cards'>${string}</div>`;
                } else if (proj[i].type === 'ol-large') {
                    for (let ii in proj[i].text) {
                        string += `<p>${proj[i].text[ii]}</p>`
                    }
                    string = `<div class="${proj[i].type}">`+string+'</div>';
                } else if (proj[i].type === 'grid') {
                    for (let ii in proj[i].text) {
                        let temp = ''; 
                        for (let iii in proj[i].text[ii]) {
                            temp += `<div>${proj[i].text[ii][iii]}</div>`;
                        }
                        string += temp;
                    }
                    string = `<div class="${proj[i].type}" style='grid-template-columns:${proj[i].col}'>`+string+'</div>';
                } else if (proj[i].type === 'flow-chart') {
                    for (let ii in proj[i].text) {
                        if (ii < proj[i].text.length -1) {
                            string += `<div class='island'><p class="flow-chart-header">${proj[i].text[ii].header}</p><p>${proj[i].text[ii].body}</p></div><div class=" flex flow-line"><div class="flow-line-top"></div><div></div></div>`;
                        } else {
                            string += `<div class='island'><p class="flow-chart-header">${proj[i].text[ii].header}</p><p>${proj[i].text[ii].body}</p></div>`;
                        }
                    }
                    string = `<div class="flex ${proj[i].type}">`+string+'</div>';
                }                                                                              
                compiller.push(string);
            }
            let HTMLstring = dataToString(compiller);
            // HTMLstring += '<button>minimize section</button>';
            return HTMLstring;
        }
    }
}
