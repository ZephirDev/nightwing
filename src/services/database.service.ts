import { Database, RunResult, Statement } from "sqlite3";
import { ServiceInterface } from "./service.interface";
import fsService from "./fs.service";
import { Logger } from "../logger";
import { File } from "../types/fs/file";

export default new class implements ServiceInterface {
    private database: Database;

    private run(sql: string, params: any[] = []): Promise<void>
    {
        return new Promise((resolve, reject) => {
            this.database.run(sql.trim(), params, (err: Error) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        })
    }

    private get(sql: string, params: any[] = []): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this.database.get(sql.trim(), params, (err: Error, result: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        })
    }

    async init(): Promise<void>
    {
        const databaseFile = fsService.getDatabaseFile();
        const databaseBackupFile = new File(`${databaseFile.toString()}.bak`);

        if (databaseBackupFile.exists()) {
            // We get a backup file that mean the migrations has failed.
            // We restore the backup file and start again.
            databaseBackupFile.copyTo(databaseFile);
        } else if (databaseFile.exists()) {
            // We make a backup before open the database to avoid migration failure.
            databaseFile.copyTo(databaseBackupFile);
        }

        databaseFile.dirname().mkdirs();
        this.database = new Database(databaseFile.toString());

        await this.run(`CREATE TABLE IF NOT EXISTS version(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            version INTEGER NOT NULL,
            executed_at DATETIME NOT NULL
        )`);

        let version = (await this.getVersion()) || 0;

        for (const migration of [
            this.migrate_version_1,
        ].slice(version)) {
            version++;
            Logger.info(`Execute migration ${version}`);
            await migration.call(this);
            await this.setVersion(version);
        }

        databaseBackupFile.delete();
    }

    private async migrate_version_1(): Promise<void>
    {
        await this.run(`CREATE TABLE github_tags_survey(
            project VARCHAR(255) PRIMARY KEY,
            last_tag VARCHAR(255) NOT NULL
        )`);
    }

    async destroy(): Promise<void>
    {
        this.database.close();
    }

    async getVersion(): Promise<number|null>
    {
        const result = await this.get(`
            SELECT * FROM version
            ORDER BY executed_at
            LIMIT 1
        `);
        
        if (!result) {
            return null;
        }

        return result.version;
    }

    private async setVersion(number: number): Promise<void>
    {
        await this.run(`INSERT INTO version (version, executed_at) VALUES (${number}, DATE('now'))`);
    }

    async getLastTagVersion(project: string): Promise<string | null>
    {
        const result = await this.get(`
            SELECT * FROM github_tags_survey
            WHERE project = ?
            LIMIT 1
        `, [project]);
        
        if (!result) {
            return null;
        }

        return result.last_tag;
    }

    async setLastTagVersion(project: string, tag: string): Promise<void>
    {
        await this.run(`
            INSERT INTO github_tags_survey (project, last_tag)
            VALUES (?, ?)
        `, [project, tag]);
    }
} 
