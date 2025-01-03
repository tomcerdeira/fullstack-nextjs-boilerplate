
export class EnvironmentVariables {

    public static get() {
        return {
            app_port: process.env.PORT || 3000,
            node_env: process.env.NODE_ENV || 'local',
            version: process.env.npm_package_version || 'NO_VERSION_SET',
            backend_base_url: process.env.BACKEND_BASE_URL || 'NO_URL_SET',
            front_end_url_base_url: process.env.FRONT_END_BASE_URL || `http://localhost:${process.env.PORT || 3000}`,
            postgres_database: {
                host: process.env.POSTGRES_HOST || 'localhost',
                port: Number(process.env.POSTGRES_PORT) || 5432,
                username: process.env.POSTGRES_USER || 'postgres',
                password: process.env.POSTGRES_PASSWORD || 'postgres',
                database: process.env.POSTGRES_DB || 'database',
            },
            mongodb_database: {
                collection_name: process.env.MONGODB_COLLECTION_NAME || 'collection',
                connection_string: process.env.MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017',
                database_name: process.env.MONGODB_DATABASE_NAME || 'database',
            },
            auth: {
                token_expiration_time: process.env.TOKEN_EXPIRATION_TIME || '7d',
                refresh_token_expiration_time: process.env.REFRESH_TOKEN_EXPIRATION_TIME || '30d',
                jwt_secret: process.env.JWT_SECRET || 'NO_SECRET_SET',
                refresh_secret: process.env.REFRESH_JWT_SECRET || 'NO_REFRESH_SECRET_SET',
            }
        };
    }
}