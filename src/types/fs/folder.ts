import { Path } from "./path";
import * as fs from 'fs';

export class Folder extends Path {
    
    mkdirs(mode?: fs.Mode): void
    {
        if (!this.exists()) {
            fs.mkdirSync(this.path, {
                recursive: true,
                mode
            })
        }
    }

}