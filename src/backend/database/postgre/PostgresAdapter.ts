import postgres from 'postgres';
import { EnvironmentVariables } from "../../shared/EnvironmentVariables";
import { DatabaseAdapter } from '../DatabaseAdapter.interface';

class PostgresAdapter implements DatabaseAdapter {
    private sql: postgres.Sql;

    constructor() {
        this.sql = postgres({
            host: EnvironmentVariables.get().postgres_database.host,
            port: EnvironmentVariables.get().postgres_database.port,
            database: EnvironmentVariables.get().postgres_database.database,
            username: EnvironmentVariables.get().postgres_database.username,
            password: EnvironmentVariables.get().postgres_database.password,
            transform: {
                undefined: null
            }
        });
    }

    getConnection(): postgres.Sql {
        return this.sql;
    }

    async query<T>(queryString: string, params?: any[]): Promise<T[]> {
        return await this.sql.unsafe(queryString, params) as T[];
    }

    async insert<T>(table: string, data: Partial<T>): Promise<T> {
        const columns = Object.keys(data);
        const values = Object.values(data);
        const placeholders = values.map((_, i) => `$${i + 1}`);
        
        const query = `
            INSERT INTO ${table} (${columns.join(', ')})
            VALUES (${placeholders.join(', ')})
            RETURNING *
        `;
        
        const result = await this.sql.unsafe<T[]>(query, values as any[]);
        return result[0] as T;
    }

    async update<T>(table: string, data: Partial<T>, conditions: Record<string, any>): Promise<T> {
        const setValues = Object.entries(data).map(([key], i) => `${key} = $${i + 1}`);
        const whereConditions = Object.entries(conditions).map(([key], i) => `${key} = $${i + 1 + Object.keys(data).length}`);
        
        const query = `
            UPDATE ${table}
            SET ${setValues.join(', ')}
            WHERE ${whereConditions.join(' AND ')}
            RETURNING *
        `;
        
        const values = [...Object.values(data), ...Object.values(conditions)];
        const result = await this.sql.unsafe<T[]>(query, values as any[]);
        return result[0] as T;
    }

    async delete(table: string, conditions: Record<string, any>): Promise<boolean> {
        const whereConditions = Object.entries(conditions).map(([key], i) => `${key} = $${i + 1}`);
        
        const query = `
            DELETE FROM ${table}
            WHERE ${whereConditions.join(' AND ')}
        `;
        
        const result = await this.sql.unsafe(query, Object.values(conditions));
        return result.count > 0;
    }

    async begin(callback: (sql: postgres.Sql) => Promise<void>): Promise<void> {
        await this.sql.begin(callback);
    }

    async unsafe(query: string, params?: any[]): Promise<any> {
        return await this.sql.unsafe(query, params);
    }

    async connect(): Promise<void> {
        // postgres.js handles connection automatically
        return Promise.resolve();
    }

    async disconnect(): Promise<void> {
        await this.sql.end();
    }
}

export const postgreDbAdapter = new PostgresAdapter();