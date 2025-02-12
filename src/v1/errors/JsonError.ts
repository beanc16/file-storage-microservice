interface NestedErrorInfo
{
    error?: Error & {
        http_code: number;
    };
    message?: string;
    http_code?: number;
}

interface ToJsonOptions
{
    includeStackTrace?: boolean;
    includeStatusCode?: boolean;
}

export interface ToJsonResponse
{
    name: string;
    message: string;
    stackTrace?: string;
    statusCode?: number;
}

export class JsonError extends Error
{
    public statusCode?: number;

    constructor(err: Error & NestedErrorInfo)
    {
        super(err.message || err?.error?.message);
        this.name = 'JsonError';

        if (err.http_code)
        {
            this.statusCode = err.http_code;
        }
        else if (err.error && err.error.http_code)
        {
            this.statusCode = err.error.http_code;
        }
    }

    public toJson({ includeStackTrace = false, includeStatusCode = false }: ToJsonOptions = {}): ToJsonResponse
    {
        const result: ToJsonResponse = {
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
