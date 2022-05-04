Macro.add('statusDisplayMacro', {
    skipArgs: false,
    handler: function () {
        let { statusEffect } = this.args[0]

        _.each(statusEffect, ({name, duration, mod, dmg})=>{
            $(this.output).wiki(`${name}<br/>`)
        })
        
    }
})