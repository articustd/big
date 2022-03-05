import { logger } from "@util/Logging"
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'


Macro.add('passagePreviewerMacro', {
    skipArgs: false,
    handler: function () {
        let defaultText = `This is a test for $player.name, they are a $player.gender.type $player.species and stand at ''$player.measurements.height cm!''<br/><br/>You could also [["link back to home"|home]] on the fly, try it out!`
        let editor = new Editor({
            extensions: [
                StarterKit,
            ],
            content: defaultText,
        })

        editor.on('update', ()=>{
            $('#preview').empty()
            $('#preview').wiki(editor.getText())
        })
        $('<div/>').wiki('Twine Preview').appendTo(this.output)
        $('<div id="preview"/>').wiki(defaultText).css({padding: '5px', border: 'solid 2px', "border-radius": "5px"}).appendTo(this.output)
        $('<br/>').appendTo(this.output)
        $('<div/>').wiki('Twine Editor').appendTo(this.output)
        $('<div/>').css({padding: '5px', border: 'solid 2px', "border-radius": "5px"}).append(editor.options.element).appendTo(this.output)
    }
})