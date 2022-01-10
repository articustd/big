Macro.add('skillsMacro', {
    skipArgs: false,
    handler: function () {
        // if (this.args.length < 1) {
        //     var errors = [];
        //     if (this.args.length < 1) { errors.push('Var 1 Missing') }
        //     if (this.args.length < 2) { errors.push('Var 2 Missing') }
        //     return this.error(`${errors[0]}  ${errors.length == 2 ? "and " + errors[1] : ""}`)
        // }
        let $table = $('<table/>');
        let $wrapper = $(document.createElement('span'));
        let tableData = [['Skill', 'Description', 'Points']];
        skills.forEach(function (skill, idx) {
            if(!State.variables.player.skills.includes(idx))
                tableData.push([skill.name, skill.desc, skill.cost, idx])
        })

        $.each(tableData, function (rowIndex, r) {
            var $row = $('<tr/>')
            if (rowIndex > 0) {
                $row.append($(`<td/>`).wiki(r[0]))
                $row.append($(`<td/>`).wiki(r[1]))
                var $button = $(document.createElement('button')).wiki(r[2]).ariaClick(function (ev) {
                    if(State.variables.player.skillPoints >= r[2]) {
                        State.variables.player.skills.push(r[3])
                        State.variables.player.skillPoints -= r[2]
                        delete State.variables.skillText
                    } else
                        State.variables.skillText = `You don't have enought Skill Points!`
                    
                    Engine.play(passage(), true)
                })
                $row.append($(`<td/>`).append($button))
            } else {
                $.each(r, function(colIndex, c) {
                    $row.append($(`<th/>`).wiki(c))
                })
            }
            $table.append($row)
        });

        $wrapper
            .attr('id', `macro-${this.name}`)
            .addClass('skills-table')
            .append($table)
            .appendTo(this.output);
    }
})