import { Migration } from "../../Migration";
import { v010 } from ".";

export class v09 extends Migration {
    constructor() {
        // Note: the next version (in this case it was v10) can be left blank if there is no next version to chain
        // Example: super(0, 9, 0)
        super(0, 9, 0, v010)
    }

    // Overload the method to change the twine state to update it to the new data layout
    migrate(twineVariables, version) {
        // Do your state manipulation here

        // Always call super.migrate() to update version and to start the chained version updating
        super.migrate(twineVariables, version)
    }
}