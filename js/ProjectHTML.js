class ProjectHTML {
    constructor(projectContentData) {
        this.title = projectContentData.content.title;
        this.medium = projectContentData.content.medium;
        this.visual = projectContentData.content.thumbnail;
        this.summary = projectContentData.content.summary;
        this.composeHTML = function () {
            let projectPOP = {
                title: `<h2 class="">${this.title}</h2>`,
                medium: `<h4>${this.medium}</h4>`,
                thumbnail: `<img class='thumbnail' src='${this.visual}'>`,
                summary: `<div class="text-box"><p>${this.summary}<p/></div>`,
                button: "<button class='cta bg-accent text-main'>Tell me more...</button>"
            };
            return projectPOP;
        };
    }
}