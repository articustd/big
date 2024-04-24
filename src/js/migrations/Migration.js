import { logger } from "@util/Logging";
import _ from "lodash";

export class Migration {
    constructor(major, minor, hotfix, nextVersion) {
        this._major = major
        this._minor = minor
        this._hotfix = hotfix
        this._nextVersion = nextVersion
    }

    // Check to see if the provided version is the same major/minor as the migration
    versionCheck(version) {
        if (this._major !== version.major)
            return false
        if (this._minor !== version.minor)
            return false

        return true
    }

    //Update the version of the save through the twine state
    updateVersion(twineVariables) {
        twineVariables.version = `v${this._major}.${this._minor}.${this.hotfix}`
    }

    //Take in the twine state and the hotfix version to migrate the save
    migrate(twineVariables, version) {
        // Debugging statements for checking if we are catching the right migration
        logger(`twineVariables.version: ${twineVariables.version}`)
        logger(`Provided version: ${JSON.stringify(version)}`)
        logger(`Migration version: ${JSON.stringify(this.version)}`)

        this.updateVersion(twineVariables)
        if (!_.isUndefined(this._nextVersion))
            this._nextVersion.migrate(twineVariables)
    }

    // Return a string of the version
    stringifiedVersion() {
        return `v${this._major}.${this._minor}.${this.hotfix}`
    }

    get major() { return this._major }
    set major(major) { this._major = major }

    get minor() { return this._minor }
    set minor(minor) { this._minor = minor }

    get hotfix() { return this._hotfix }
    set hotfix(hotfix) { this._hotfix = hotfix }

    get nextVersion() { return this._nextVersion }
    set nextVersion(nextVersion) { this._nextVersion = nextVersion }

    get version() { return { major: this._major, minor: this._minor, hotfix: this._hotfix } }
}