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
                container: '<div id="westProvince" class="flex-column">',
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
                    container: `<div id="section${i}" class=section>`,
                    title: `<div class="sectionHeader section-prev-txt fs-500"><span class="fs-600">🡒</span> ${this.body[i].section}</div>`,
                    wordCount: `<div class="wordCount section-prev-txt italic">${this.body[i].wordCount} words</div>`
                } // Turn into a single string
                let HTMLstring = dataToString(section); 
                $(`#${parent}`).append(HTMLstring); // append to parent container
                //  make an array that will be useful in all scripts
                this.sectionsArr.push({index: i, id: 'section' + i, short: section.title + section.wordCount, long: this.body[i].content, open: true});
            }
        };
        this.formatSection = function(sectionIndex) {
            let compiller = [];
            let proj = this.body[sectionIndex].content;
            console.log(proj)
            for (let i in proj) {
                let string = '';
                if (proj[i].type === 'p') {
                    console.log('paragraph');
                    string = `<p>${proj[i].text}</p>`
                } 
                compiller.push(string);
            }
            let HTMLstring = dataToString(compiller);
            return HTMLstring;
        }
    }
}