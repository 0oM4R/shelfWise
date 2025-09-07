import dotenv from 'dotenv';

dotenv.config();
 
interface Config {
  port: number;
  db: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
  };
}

const config :Config = {
  port: Number(process.env?.['APP_PORT']) || 3000,
  db: {
    host: process.env?.['DB_HOST'] || 'localhost',
    port: +(process.env?.['DB_PORT'] || 5432),
    name: process.env?.['DB_NAME'] || 'database',
    user: process.env?.["DB_USER"] || 'user',
    password: process.env?.["DB_PASSWORD"]|| 'password'
  }
}

export default config