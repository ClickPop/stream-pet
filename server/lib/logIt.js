module.exports = function() {
    if (typeof arguments === 'object') {
        var argumentCount = Object.keys(arguments).length;
        if (argumentCount > 0) {
            console.group(`${new Date}`);
            for (const property in arguments) {
                console.log(arguments[property]);
            }
            console.groupEnd();
        }
    }
};
