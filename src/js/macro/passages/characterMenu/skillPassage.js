import { attackSkill } from '@js/data'
import { logger } from '@util/Logging';
import { popup } from '@controller/util/ModalPopup'
import _ from 'lodash';

Macro.add('skillPassage', {
    skipArgs: false,
    handler: function () {
    let $wrapper = $('<div/>').addClass('skills-grid');

    $wrapper.append($('<div/>').wiki(`''__Learned Skills__''`).addClass('grid-header'))
    let { passives } = variables().player
    
    _.each(passives, (skillId) => {
        let { name, desc: { baseDesc } } = attackSkill[skillId]
        $wrapper.append($('<div/>').wiki(`''${name}''`))
        $wrapper.append($('<div/>').wiki(`${baseDesc}`))
    })
    
    $wrapper.appendTo(this.output);
    }
})