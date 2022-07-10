class JsonError extends Error
{
    constructor(err) {
        super(err.message);
        this.name = "JsonError";

        if (err.http_code)
        {
            this.statusCode = err.http_code;
        }
    }

    toJson({ includeStackTrace = false, includeStatusCode = false } = {})
    {
        const result = {
            name: this.name,
            message: this.message,
        };

        if (includeStackTrace)
        {
            result.stackTrace = this.stack;
        }

        if (includeStatusCode)
        {
            result.statusCode = this.statusCode;
        }

        return result;
    }
}



module.exports = JsonError;
