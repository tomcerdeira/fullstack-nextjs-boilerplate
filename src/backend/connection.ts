import postgres from 'postgres';
import { EnvironmentVariables } from "./shared/EnvironmentVariables";

const DATABASE_HOST = EnvironmentVariables.get().postgres_database.host;
const DATABASE_PORT = EnvironmentVariables.get().postgres_database.port;
const DATABASE_USER = EnvironmentVariables.get().postgres_database.username;
const DATABASE_PASSWORD = EnvironmentVariables.get().postgres_database.password;
const DATABASE_NAME = EnvironmentVariables.get().postgres_database.database;

const sql = postgres({
        host                 : DATABASE_HOST,
        port                 : DATABASE_PORT,
        database             : DATABASE_NAME,
        username             : DATABASE_USER,
        password             : DATABASE_PASSWORD,
        transform: {
            undefined: null
        }
})
export default sql;