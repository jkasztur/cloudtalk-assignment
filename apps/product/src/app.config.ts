import { DataSourceOptions } from "typeorm";

export type Config = {
	postgres: DataSourceOptions;
	redis: {
		host: string;
		port: number;
	};
}

export default (): Config => ({
	postgres: {
		host: process.env.DB_HOST,
		port: parseInt(process.env.DB_PORT, 10) || 5432,
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		type: 'postgres',
	},
	redis: {
		host: process.env.REDIS_HOST,
		port: parseInt(process.env.REDIS_PORT, 10) || 6379,
	}
})