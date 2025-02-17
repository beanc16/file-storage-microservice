import Joi from 'joi';

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return */
export function validateJoiSchema(schema: Joi.Schema, payload: unknown): void
{
    const { value, error } = schema.validate(payload);

    if (error)
    {
        throw error;
    }

    return value;
}
/* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return */
