require('dotenv').config();

const logIt = function() {
    const logLevel = process.env.LOGIT_LEVEL || "normal";
    if (logLevel !== "disabled" && typeof arguments === 'object') {
        var argumentCount = Object.keys(arguments).length;
        if (argumentCount > 0) {
            if (logLevel === "verbose" || logLevel === "normal") {
                console.group(`${new Date}`);
                for (const property in arguments) {
                    console.log(arguments[property]);
                }
                console.groupEnd();
            } else if(logLevel === "compressed") {
                console.log(...arguments);
            }
        }
    }
}
module.exports = logIt;
