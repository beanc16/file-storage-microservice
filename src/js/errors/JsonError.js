class JsonError extends Error
{
    constructor(err) {
        super(err.message);
        this.name = "JsonError";
    }

    toJson({ includeStackTrace = false } = {})
    {
        const result = {
            name: this.name,
            message: this.message,
        };

        if (includeStackTrace)
        {
            result.stackTrace = this.stack;
        }

        return result;
    }
}



module.exports = JsonError;
