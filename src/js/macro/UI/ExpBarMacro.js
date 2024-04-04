Macro.add('expBarMacro', {
    skipArgs: false,
    handler: function () {
        let character = this.args[0]
        let align = this.args[1]
        let capType = this.args[2]


        let $Bar = $('<div/>')
            .addClass(`statusBar`)
            .css(`margin-${align?'left':'right'}`,'auto')

        let $currentBar = $('<div/>')
            .addClass('expBar statusBar')

        let $currentText = $('<div/>')
            .addClass('currentStatusText')

        switch(capType){
            case "muscle":
                $currentBar.css('width', `${Math.clamp(Math.floor((character.exp.muscle/character.stats.strg)*100),0,100)}%`)
                $currentText.text(`${character.exp.muscle}/${character.stats.strg}`)
                break;
            case "agility":
                $currentBar.css('width', `${Math.clamp(Math.floor((character.exp.agility/character.stats.dex)*100),0,100)}%`)
                $currentText.text(`${character.exp.agility}/${character.stats.dex}`)
                break;
            case "physique":
                $currentBar.css('width', `${Math.clamp(Math.floor((character.exp.physique/character.stats.con)*100),0,100)}%`)
                $currentText.text(`${character.exp.physique}/${character.stats.con}`)
                break;
            case "size":
                $currentBar.css('width', `${Math.clamp(Math.floor((character.exp.size/character.measurements.height)*100),0,100)}%`)
                $currentText.text(`${character.exp.size}/${character.measurements.height}`)
                break;
            case "fat":
                break;
            case "skill":
                break;
        }

        if(this.args[1])
            $Bar.css('float', this.args[1])

        $Bar
            .attr('id', `macro-${this.name}-${character.name}-` + capType)
            .append($currentText)
            .append($currentBar)
            .appendTo(this.output)
    }
})
