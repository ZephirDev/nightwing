import { resolve, dirname } from 'path';
import * as fs from 'fs';
import type { Folder } from './folder';

export class Path {
    protected path: string;

    constructor(
        path: string,
    ) {
        this.path = resolve(path);
    }

    exists(): boolean
    {
        return fs.existsSync(this.path);
    }

    dirname(): Folder
    {
        const {Folder} = require('./folder');
        return new Folder(dirname(this.path));
    }

    toString(): string {
        return this.path;
    }
}
