class ProjectHTML {
    constructor(projectContentData) {
        this.id = projectContentData.id;
        this.title = projectContentData.content.title;
        this.medium = projectContentData.content.medium;
        this.visual = projectContentData.content.thumbnail;
        this.summary = projectContentData.content.summary;
        this.link = projectContentData.link;
        this.composeHTML = function () {
            let projectPOP = {
                title: `<h3 class="text-contrast">${this.title}</h3>`,
                thumbnail: `<img class='thumbnail text-contrast' src='${this.visual}'>`,
                medium: `<h4 class="text-contrast">${this.medium}</h4>`,
                summary: `<div class="text-box noScrollBar text-contrast"><p>${this.summary}<p/></div>`,
                button: `<a href='${this.link}' target="_blank" class="underless"><button class='cta text-main'><h5>Tell me more...</h5></button></a>`
            };
            return projectPOP;
        };
    }
}