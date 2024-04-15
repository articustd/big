import { logger } from "@util/Logging"

Macro.add('TransferenceBuy', {
    skipArgs: false,
    handler: function () {
        let { player } = variables()
        let {skillPoints, credits} = temporary()
        
        let $skillPointContainer = $('<div/>').addClass('trans-exchange-side')
        $skillPointContainer.append($('<span/>').wiki('Skill Points'))
        let $skillCount = $('<span/>').text(player.skillPoints).appendTo($skillPointContainer)

        let $creditContainer = $('<div/>').addClass('trans-exchange-side')
        $creditContainer.append($('<span/>').wiki('Credits'))
        let $creditCount = $('<span/>').text(player.credits).appendTo($creditContainer)

        let $transferBtn = $('<button/>').append($('<i/>').addClass("fa fa-exchange")).click(()=>{
            player.skillPoints += skillPoints
            player.credits += credits

            //$('.trans').append('<div/>').addClass('system-message').wiki('Skill points: ' + skillPoints + '<br/><br/>Credits: ' + credits)

            let transactionText
            if (skillPoints < 0)
                transactionText = 'You gave up ' + Math.abs(skillPoints) + ' skill points and got ' + Math.abs(credits) + ' credits in return!'

            if (credits < 0)
                transactionText = 'You paid ' + Math.abs(credits) + ' credits and got ' + Math.abs(skillPoints) + ' skill points in return!'

            State.variables.transferText = transactionText
            Engine.show()
        })

        $(this.output)
            .append($skillPointContainer)
            .append($transferBtn)
            .append($creditContainer)

        function updateCounters() {
            ({skillPoints, credits} = temporary())
            $skillCount.text(player.skillPoints + skillPoints)
            $creditCount.text(player.credits + credits)
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