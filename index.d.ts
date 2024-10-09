import { QueryResult, PoolConfig, PoolClient, Pool } from 'pg';
import pg from 'pg';

export declare class PGHelper {
	pool: Pool;
	constructor(config: PoolConfig);
	GetPG(): any;
	ExecuteSingleQuery(sql: string, args: any[]): Promise<QueryResult<any>>;
	StartTransaction(): Promise<PoolClient>;
	CommitTransaction(dbcon: PoolClient): Promise<void>;
	RollbackTransaction(dbcon: PoolClient): Promise<void>;
	ExecuteQuery(
		dbcon: PoolClient,
		sql: string,
		args: any[]
	): Promise<QueryResult<any>>;
}

export function GetPG(): any;

export function ExecuteSingleQuery(
	sql: string,
	args: any[]
): Promise<QueryResult<any>>;

export function StartTransaction(): Promise<PoolClient>;

export function CommitTransaction(dbcon: PoolClient): Promise<void>;

export function RollbackTransaction(dbcon: PoolClient): Promise<void>;

export function ExecuteQuery(
	dbcon: PoolClient,
	sql: string,
	args: any[]
): Promise<QueryResult<any>>;
