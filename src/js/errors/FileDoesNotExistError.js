const JsonError = require("./JsonError");



class FileDoesNotExistError extends JsonError
{
    constructor(filePath) {
        super({ message: `File at '${filePath}' does not exist` });
        this.name = "FileDoesNotExistError";
    }
}



module.exports = FileDoesNotExistError;
