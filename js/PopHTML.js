class PopHTML {
    constructor(projectContentData) {
        this.id = projectContentData.id;
        this.title = projectContentData.content.title;
        this.medium = projectContentData.content.medium;
        this.visual = projectContentData.content.thumbnail;
        this.summary = projectContentData.content.summary;
        this.link = projectContentData.link;
        this.composeHTML = function () {
            let projectPOP = {
                title: `<h3 class="">${this.title}</h3>`,
                thumbnail: `<img class='thumbnail ' src='${this.visual}'>`,
                medium: `<h4 class="">${this.medium}</h4>`,
                summary: `<div class="text-box noScrollBar "><p>${this.summary}<p/></div>`,
                button: `<a href='${this.link}' class="underless"><button class='cta text-main lowercase'><h5>Tell me more...</h5></button></a>`
            };
            return projectPOP;
        };
    }
}