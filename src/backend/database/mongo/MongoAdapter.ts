import { NotFoundException } from '@/backend/shared/exceptions/NotFoundException';
import { Collection, Db, MongoClient } from 'mongodb';
import { EnvironmentVariables } from "../../shared/EnvironmentVariables";
import { DatabaseAdapter } from '../DatabaseAdapter.interface';

//TODO: test its working

class MongoAdapter implements DatabaseAdapter {
    private client: MongoClient;
    private db!: Db;

    constructor() {
        const { host, port, database, username, password, connection_string } = EnvironmentVariables.get().mongodb_database;
        if(!connection_string || (!host && !port && !database && !username && !password)) throw new Error('No connection string found for connection to MongoDB instance');
        const uri = connection_string || `mongodb://${username}:${password}@${host}:${port}/${database}`;
        this.client = new MongoClient(uri);
    }

    getCollection(name: string): Collection {
        return this.db.collection(name);
    }

    async connect(): Promise<void> {
        await this.client.connect();
        this.db = this.client.db();
    }

    async disconnect(): Promise<void> {
        await this.client.close();
    }

    /*
     Example usage:

        const query = {
            collection: "users",
            age: { $gt: 18 }
        };
        const users = await mongoAdapter.query<User>(JSON.stringify(query));

    */
    async query<T>(queryString: string): Promise<T[]> {
        // MongoDB doesn't use SQL queries, so we'll parse the query string as a JSON query
        try {
            const collection = this.getCollectionFromQuery(queryString);
            const query = JSON.parse(queryString);
            return await collection.find(query).toArray() as T[];
        } catch (error) {
            throw new Error(`Invalid MongoDB query format: ${error}`);
        }
    }

    async insert<T>(table: string, data: Partial<T>): Promise<T> {
        const collection = this.db.collection(table);
        const result = await collection.insertOne(data as any);
        return { ...data, _id: result.insertedId } as T;
    }

    async update<T>(table: string, data: Partial<T>, conditions: Record<string, any>): Promise<T> {
        const collection = this.db.collection(table);
        const result = await collection.findOneAndUpdate(
            conditions,
            { $set: data },
            { returnDocument: 'after' }
        );
        if (!result?.value) throw NotFoundException.createFromMessage('Document not found');
        return result.value as T;
    }

    async delete(table: string, conditions: Record<string, any>): Promise<boolean> {
        const collection = this.db.collection(table);
        const result = await collection.deleteOne(conditions);
        return result.deletedCount > 0;
    }

    private getCollectionFromQuery(queryString: string): Collection {
        // Extract collection name from the query string
        // This is a simplified implementation
        const collectionMatch = queryString.match(/collection:\s*"([^"]+)"/);
        if (!collectionMatch) {
            throw new Error('Collection name not found in query');
        }
        return this.db.collection(collectionMatch[1]);
    }

}

export const mongoDbAdapter = new MongoAdapter(); 