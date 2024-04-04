import { logger } from "@util/Logging";

Macro.add('creditMacro', {
    skipArgs: false,
    handler: function () {
        //Articus credits
        $image = $('<img/>').addClass('creditImg').attr('src', 'assets/credits/gunpoint.gif')
        $overlay = $('<div/>').addClass('creditOverlay').wiki('Articus/Gunpoint<br />Initial programmer') //Text on hover
        $wrapper = $('<div/>').addClass('creditWrapper').click(()=>{
            window.location = "https://www.furaffinity.net/user/gunpoint/", "_blank"
        })
        $wrapper.append($overlay).append($image)
        $wrapper.appendTo(this.output)

        //Ruweg credits
        $image = $('<img/>').addClass('creditImg').attr('src', 'assets/credits/ruweg.png')
        $overlay = $('<div/>').addClass('creditOverlay').wiki('Ruweg<br/>Programmer') //Text on hover
        $wrapper = $('<div/>').addClass('creditWrapper').click(()=>{
            window.location = "https://www.furaffinity.net/user/randomwolfguy/", "_blank"
        })
        $wrapper.append($overlay).append($image)
        $wrapper.appendTo(this.output)

        //Dragonien credits
        let $image = $('<img/>').addClass('creditImg').attr('src', 'assets/credits/raindrago.jpg')
        let $overlay = $('<div/>').addClass('creditOverlay').wiki('Rain/Dragonien<br />Guest writer') //Text on hover
        let $wrapper = $('<div/>').addClass('creditWrapper').click(()=>{
            window.location = "https://www.furaffinity.net/user/dragonien/", "_blank"
        })
        $wrapper.append($overlay).append($image)
        $wrapper.appendTo(this.output)
    }
})