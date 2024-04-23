import { logger } from "@util/Logging";
import _ from "lodash";

import * as versions from './versions'
import { Migration } from "./versions/Migration";

export function migrateSave(save, currentVersion) {
    // Get JSON version from the current version string
    let version = parseVersion(currentVersion)

    _.each(save.state.history, ({ variables }) => {
        // Get JSON version from the history's version string
        let historyVersion = parseVersion(variables.version)

        // If the history's version is older, find correct migration and migrate
        if (isOlderVersion(historyVersion, version)) {
            // Do I have a migration for my current historical version?
            let migration = findMigrationVersion(historyVersion)
            
            // If I don't find a migration, find a newer one closest to the historical version
            if(_.isUndefined(migration))
                migration = findClosestMigration(historyVersion)
            
            // If I still haven't found one, then I need to bump the version number using a new Migration
            if(_.isUndefined(migration))
                migration = new Migration(version.major, version.minor, version.hotfix)

            // Now that I have a valid Migration I need to migrate the historical twine state
            migration.migrate(variables, historyVersion)
        }
    })
}

// Find a migration with the same major and minor version
function findMigrationVersion(version) {
    return _.find(versions, (migration) => {
        return migration.versionCheck(version)
    })
}

// Find a migration that is ahead of the given version
// Can return an empty variable
function findClosestMigration(version) {
    let closestMigration;

    _.each(versions, (migration) => {
        // Is the migration version older than the provided version
        if(isOlderVersion(version, migration.version)) {
            // If we previously found a migration, check to see if this migration is closer
            if(!_.isUndefined(closestMigration)) {
                if(isOlderVersion(migration.version, closestMigration.version))
                    closestMigration = migration
            } else {
                closestMigration = migration
            }
        }
    })

    return closestMigration
}

// Parse a string version number into a JSON object
function parseVersion(version) {
    // Split the text version on the decimal
    let [major, minor, hotfix] = _.split(version, '.')

    // Convert strings to integers for comparison
    major = _.toInteger(_.split(major, 'v'))
    minor = _.toInteger(minor)
    hotfix = _.toInteger(hotfix)

    // Return JSON of version
    return { major, minor, hotfix }
}

// Compare version1 vs version2
// Return true if version1 is older
function isOlderVersion(v1, v2) {
    if (v1.major < v2.major)
        return true
    if (v1.minor < v2.minor)
        return true
    if (v1.hotfix < v2.hotfix)
        return true
    return false
}