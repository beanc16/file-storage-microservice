import { Success } from 'dotnet-responses';
import express from 'express';

export const ping = (_: express.Request, res: express.Response): void =>
{
    Success.json({
        res,
        message: 'Pong',
    });
};
