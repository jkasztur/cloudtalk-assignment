import { DataSourceOptions } from 'typeorm'

export type Config = {
	postgres: {
		host: string
		port: number
		username: string
		password: string
		database: string
		type: DataSourceOptions['type']
	}
	redis: {
		host: string
		port: number
		database: number
	}
}

export default (): Config => {
	const config: Config = {
		postgres: {
			host: process.env.DB_HOST || 'localhost',
			port: parseInt(process.env.DB_PORT, 10) || 3006,
			username: process.env.DB_USERNAME || 'postgres',
			password: process.env.DB_PASSWORD || 'postgres',
			database: process.env.DB_DATABASE || 'postgres',
			type: 'postgres',
		},
		redis: {
			host: process.env.REDIS_HOST || 'localhost',
			port: parseInt(process.env.REDIS_PORT, 10) || 3005,
			database: parseInt(process.env.REDIS_DATABASE, 10) || 0,
		},
	}
	if (process.env.NODE_ENV === 'test') {
		config.postgres.database = 'test'
		config.redis.database = 6
	}
	return config
}
