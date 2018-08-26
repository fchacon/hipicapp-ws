var _ = require('lodash');

class FilesGeneratorHelper {
    static endpointNameValidation(name){
        var response = true;
        console.log("validating the name...");

        if (name === undefined || name === 'undefined') {
            console.log("[ERROR] The name is required");
            response = false;
        } else {
            var isnum = /^\d+$/.test(name.charAt(0));
            if (isnum == true) {
                console.log("[ERROR] The name couldn't start with a number");
                response = false;
            } else if (_.lowerCase(name.slice(-1)) == 's') {
                console.log("[ERROR] The name must be singular");
                response = false;
            }
        }
        console.log("validated name")
        return response;
    }
}
module.exports = FilesGeneratorHelper;