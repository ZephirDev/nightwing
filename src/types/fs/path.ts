import { resolve, dirname } from 'path';
import * as fs from 'fs';
import type { Folder } from './folder';

export class Path {
    private static FOLDER_CLASS: any;

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
        if (!Path.FOLDER_CLASS) {
            Path.FOLDER_CLASS = require('./folder')['Folder'];
        }
        return new Path.FOLDER_CLASS(dirname(this.path));
    }

    toString(): string {
        return this.path;
    }
}
