import { logger } from "@util/Logging";

Macro.add('creditMacro', {
    skipArgs: false,
    handler: function () {

        let $image = $('<img/>').addClass('creditImg').attr('src', 'assets/credits/raindrago.jpg')
        let $overlay = $('<div/>').addClass('creditOverlay').wiki('Rain/Dragonien')
        let $wrapper = $('<div/>').addClass('creditWrapper').click(()=>{
            window.location = "https://www.dragonien.com/"
        })
        $wrapper.append($overlay).append($image)
        $wrapper.appendTo(this.output)
    }
})