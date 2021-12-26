Macro.add('consumeEnemy', {
    skipArgs: false,
    handler: function () {
        if (this.args.length < 2) {
            var errors = [];
            if (this.args.length < 1) { errors.push('Var 1 Missing') }
            if (this.args.length < 2) { errors.push('Var 2 Missing') }
            return this.error(`${errors[0]} ${errors.length == 2 ? "and " + errors[1] : ""}`)
        }

        let hunter = this.args[0];
        let prey = this.args[1];

        let method = this.parent.args[0];

        //Calculate stuff
        let consumeInfo = calcConsume(method, hunter, prey)

        addPoints(consumeInfo.points, hunter);
        
        State.variables.consumeHeader = `${method}`
        State.variables.consumeText = `${consumeInfo.bodyText}`

        delete State.variables.enemy

        state.display("consumeFlavor", this);
    }
})

function calcConsume(method, hunter, prey) {
    let response = {};
    response.bodyText = consumeBodyText(method);

    response.points = {muscle: randPoints(prey.exp.muscle), fat: randPoints(prey.exp.fat), size: randPoints(prey.exp.size), skill: randPoints(prey.exp.skill)}

    return response;
}

function randPoints(range) {
    return random(range[0],range[1]);
}

function consumeBodyText(method) {
    switch(method) {
        case 'Eat':
            return `You shove the enemy down your gullet.`;
        case 'Unbirth':
            return `You shove the enemy up your lady bits.`
        case 'Anal':
            return `You shove the enemy up your hole`
        case 'Sounding':
            return `You shove the enemy in your man bits`
    }
}

function addPoints(points, hunter) {
    for(var point in points) {
        hunter.exp[point] += points[point];
    }
}