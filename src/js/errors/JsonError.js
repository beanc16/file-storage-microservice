class JsonError extends Error
{
    constructor(err) {
        super(err.message);
        this.name = "JsonError";
    }

    toJson()
    {
        return {
            name: this.name,
            message: this.message,
            stackTrace: this.stack,
        }
    }
}



module.exports = JsonError;
