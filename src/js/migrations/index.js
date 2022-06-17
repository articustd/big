import { logger } from "@util/Logging";
import * as versions from './versions'
import _ from "lodash";

export function migrate(save, currentVersion) {
    let version;

    _.each(save.state.history, ({variables})=>{
        nextVersion(variables)
        version = variables.version
    })

    if(version !== currentVersion)
        migrate(save, currentVersion)
}

function nextVersion(state) {
    let majorMinor = _.join(_.dropRight(_.split(state.version, '.')), '')
    let hotfix = _.parseInt(_.join(_.drop(_.split(state.version, '.'),2), ''))

    versions[majorMinor].upgrade(state, hotfix)
}