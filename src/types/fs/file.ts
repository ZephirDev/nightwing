import { Path } from "./path";
import * as fs from 'fs';

export class File extends Path {
    read(): string
    {
        if (!this.exists()) {
            throw new Error(`${this.toString()} file doesn't exists.`);
        }

        return fs.readFileSync(this.toString(), 'utf-8');
    }

    write(data: string)
    {
        if (!this.exists()) {
            const parent = this.dirname();
            if (!parent.exists()) {
                parent.mkdirs();
            }
        }

        fs.writeFileSync(this.toString(), data, "utf-8");
    }

    copyTo(to: File)
    {
        for (const parent of [this.dirname(), to.dirname()]) {
            parent.mkdirs();
        }

        fs.copyFileSync(this.toString(), to.toString());
    }

    delete()
    {
        if (!this.exists()) {
            return;
        }

        fs.unlinkSync(this.toString());
    }
}
