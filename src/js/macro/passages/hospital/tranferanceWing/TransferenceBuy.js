import { logger } from "@util/Logging"

Macro.add('TransferenceBuy', {
    skipArgs: false,
    handler: function () {
        let { player } = variables()
        let {skillPoints, credits} = temporary()
        
        let $skillPointContainer = $('<div/>').addClass('trans-exchange-side')
        $skillPointContainer.append($('<span/>').wiki('Skill Points'))
        let $skillCount = $('<span/>').text(skillPoints).appendTo($skillPointContainer)

        let $creditContainer = $('<div/>').addClass('trans-exchange-side')
        $creditContainer.append($('<span/>').wiki('Credits'))
        let $creditCount = $('<span/>').text(credits).appendTo($creditContainer)

        let $transferBtn = $('<button/>').append($('<i/>').addClass("fa fa-exchange")).click(()=>{
            player.skillPoints += skillPoints
            player.credits += credits
            Engine.show()
        })

        $(this.output)
            .append($skillPointContainer)
            .append($transferBtn)
            .append($creditContainer)

        function updateCounters() {
            ({skillPoints, credits} = temporary())
            $skillCount.text(skillPoints)
            $creditCount.text(credits)
        }

        function checkDisabled() {
            $transferBtn.prop('disabled', false)
            if(skillPoints === 0)
                $transferBtn.prop('disabled', true)
        }

        doAfterRender(()=>{
            $('body').on('UpdateCounters', () => {
                updateCounters()
                checkDisabled()
                $('body').trigger('UpdateChange')
            })
        })

        checkDisabled()
    }
})

function doAfterRender(callback) {
    if (Engine.isRendering())
        setTimeout(doAfterRender, 50, callback)
    else
        callback()
}