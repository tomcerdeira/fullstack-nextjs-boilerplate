import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { postgreDbAdapter } from '../PostgresAdapter';

const upMigrationsDir = path.join(__dirname, '/up');
const downMigrationsDir = path.join(__dirname, '/down');

function calculateFileHash(filePath: string) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHmac('sha256', 'fixed-seed');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

async function getMigrationHash(migrationName: string) {
  const rows = await postgreDbAdapter.query<any>(`SELECT hash FROM migrations WHERE file_name = '${migrationName}'`);
  if (rows.length > 0) {
    return rows[0].hash;
  }
  return null;
}

async function markMigrationAsRun(migrationName: string, fileHash: string) {
  await postgreDbAdapter.insert('migrations', { file_name: migrationName, hash: fileHash });
}

async function runMigration(filePath: string) {
  const query = fs.readFileSync(filePath, { encoding: 'utf-8' });
  const fileName = path.basename(filePath);
  const fileHash = calculateFileHash(filePath);
  const existingHash = await getMigrationHash(fileName);

  if (existingHash) {
    if (existingHash === fileHash) {
      console.log(`Migration ${fileName} has already been run and hasn't changed. Skipping.`);
      return;
    } else {
      throw new Error(`Hash mismatch for migration ${fileName}. Migration has been altered since it was last run. Halting migrations.`);
    }
  }

//   await postgreDbAdapter.begin(async (sql) => {
//     const result = await sql`SELECT * FROM users WHERE email = 'mandy@example.com' OR email = 'mandy2@example.com'`;
//     console.log(result);
// });

  await postgreDbAdapter.begin(async (sql) => {
    // setSQL(sql);

    try {
      await postgreDbAdapter.query(query);
      await markMigrationAsRun(fileName, fileHash);
      console.log(`Successfully ran migration: ${fileName}`);
    } catch (err) {
      console.error(`Error running migration: ${fileName}`, err);
      throw err;
    }
  });

  // setSQL(sql);
  
}

async function runMigrations() {
  try {
    const files = fs.readdirSync(upMigrationsDir).filter(file => file.endsWith('.sql'));

    for (const file of files) {
      await runMigration(path.join(upMigrationsDir, file));
    }

    await postgreDbAdapter.disconnect();
    console.log('All migrations finished. Database connection closed.');
  } catch (error) {
    console.error('Migration process halted due to an error:', error);
    postgreDbAdapter.disconnect();
    throw error;
  }
}

async function runLastDownMigration() {
  const [lastMigration] = await postgreDbAdapter.query<any>(`SELECT file_name FROM migrations ORDER BY applied_at DESC LIMIT 1`);

  if (!lastMigration) {
      console.log("No migrations have been run.");
      return;
  }

  const fileName = lastMigration.file_name;
  const downMigrationFilePath = path.join(downMigrationsDir, fileName);
  console.log(downMigrationFilePath)

  if (!fs.existsSync(downMigrationFilePath)) {
      throw new Error(`Down migration script not found for the last applied migration: ${fileName}`);
  }

  await postgreDbAdapter.begin(async sql => {
      // setSQL(sql);

      try {
          const query = fs.readFileSync(downMigrationFilePath, { encoding: 'utf-8' });
          await postgreDbAdapter.query(query);
          await postgreDbAdapter.query(`DELETE FROM migrations WHERE file_name = '${fileName}'`);
          console.log(`Successfully ran DOWN migration: ${fileName}`);
      } catch (err) {
          console.error(`Error running DOWN migration: ${fileName}`, err);
          throw err;
      }
  });

  // setSQL(sql);
}

const runMode = process.argv[2];

async function main() {
  try {
      if (runMode === 'down') {
          console.log("Running DOWN migrations...");
          await runLastDownMigration();
      } else {
          console.log("Running UP migrations...");
          await runMigrations();
      }
      console.log('Migration process completed successfully.');
      process.exit(0);
  } catch (error) {
      console.error('Migration process halted due to an error:', error);
      throw error;
  }
}

main();