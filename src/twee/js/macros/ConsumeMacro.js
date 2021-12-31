Macro.add('consumeEnemy', {
    skipArgs: false,
    handler: function () {
        // if (this.args.length < 2) {
        //     var errors = [];
        //     if (this.args.length < 1) { errors.push('Var 1 Missing') }
        //     if (this.args.length < 2) { errors.push('Var 2 Missing') }
        //     return this.error(`${errors[0]} ${errors.length == 2 ? "and " + errors[1] : ""}`)
        // }

        let $wrapper = $('<span/>').css('display','block').css('text-align','center')
        let prey = this.args[0];

        let consume = [
            {method:'Eat',gen: '',desc:`You shove the enemy down your gullet.`},
            {method:'Anal',gen: '',desc:`You shove the enemy up your hole`},
            {method:'Unbirth',gen: 'vagina',desc:`You shove the enemy up your lady bits.`},
            {method:'Sound',gen: 'penis',desc:`You shove the enemy in your man bits`}
        ]

        consume.forEach(function(con) {
            if(con.gen == '' || State.variables.player.gender[con.gen]) {
                $wrapper.append(
                    $('<button/>')
                        .wiki(con.method)
                        .ariaClick(function(ev) {
                            State.variables.consumeText = con.desc
                            State.variables.consumeHeader = `${con.method}ing ${prey.name}`

                            addPoints(calcConsume(prey),State.variables.player) 
                            combatReset()
                            delete State.variables.enemy
                            Engine.play("consume")
                        })
                        .css('width','90%')
                        .css('margin-bottom', '10px')
                )
            }
        })
        
        $wrapper
            .attr('id', `macro-${this.name}`)
            .addClass('consumes')
            .appendTo(this.output);
    }
})

function calcConsume(prey) {
    let response = {};
    for(let points in prey.exp)
        response[points] = randPoints(prey.exp[points])
    
    return response;
}

function randPoints(range) {
    if(Array.isArray(range))
        return random(range[0],range[1]);
    return range
}

function addPoints(points, hunter) {
    for(var point in points) {
        hunter.exp[point] += points[point];
    }
}