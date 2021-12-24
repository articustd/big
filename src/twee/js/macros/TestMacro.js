Macro.add('testMacro', {
    skipArgs: false,
    handler: function () {
        if (this.args.length < 2) {
            var errors = [];
            if (this.args.length < 1) { errors.push('Var 1 Missing') }
            if (this.args.length < 2) { errors.push('Var 2 Missing') }
            return this.error(`${errors[0]} ${errors.length == 2 ? "and " + errors[1] : ""}`)
        }

        jQuery(this.output).text('Test Macro')
        // jQuery("consumeText").text(`You have eaten your prey`).addClass('text-fade-in');
    }
})