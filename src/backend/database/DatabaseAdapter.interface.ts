export interface DatabaseAdapter {
    // Basic CRUD operations
    query<T>(queryString: string, params?: any[]): Promise<T[]>;
    insert<T>(table: string, data: Partial<T>): Promise<T>;
    update<T>(table: string, data: Partial<T>, conditions: Record<string, any>): Promise<T>;
    delete(table: string, conditions: Record<string, any>): Promise<boolean>;
    
    // Connection management
    connect(): Promise<void>;
    disconnect(): Promise<void>;
} 