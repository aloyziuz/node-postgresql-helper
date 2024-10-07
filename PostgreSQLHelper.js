const pg = require("pg");
const conf = require("config");

class PGHelper{
    constructor(config){
        this.pool = new pg.Pool(config);
    }

    /**
	* gets pg nodule used by the helper
	*/
	GetPG(){
		return pg;
	}
    /**
     * executes a single query and returns the result
     * @param {string} sql 
     * @param {any[]} args 
     */
	async ExecuteSingleQuery(sql, args){
		var res = await this.pool.query(sql, args);
		return res;
    }
    
    /**
     * starts a new transaction. CommitTransaction or RollbackTransaction has to be called to end this transaction
     * @returns {Promise<pg.PoolClient>}
     */
	async StartTransaction(){
        var client = await this.pool.connect();
        await client.query("BEGIN");
		return client;
	}
    
    /**
     * will commit all changes in this transaction
     * @param {pg.PoolClient} dbcon 
     */
	async CommitTransaction(dbcon){
		await dbcon.query("COMMIT");
		await dbcon.release();
    } 
    
    /**
     * will undo all operations in this transaction
     * @param {pg.PoolClient} dbcon 
     */
	async RollbackTransaction(dbcon){
		await dbcon.query("ROLLBACK");
		await dbcon.release();
	}
    
    /**
     * Perform an sql query in a transaction
     * @param {pg.PoolClient} dbcon 
     * @param {string} sql 
     * @param {any[]} args 
     */
	async ExecuteQuery(dbcon, sql, args){
		var res = await dbcon.query(sql, args);
		return res;
	}
}

var dbconfig = conf.get("dbConfig");
var pghelper = new PGHelper({
    user: dbconfig.username, 
    host: dbconfig.host, 
    database: dbconfig.db, 
    password: dbconfig.password, 
    port: dbconfig.port
});


module.exports = {
    PGHelper: PGHelper,
    /**
     * Sets the config for the pg pool. Has to be called before any other method
     * @param {import("pg").PoolConfig} conf - config for the pg pool
     */
    SetPG: function(conf){
        pghelper = new PGHelper(conf);
    },
	/**
	* gets pg nodule used by the helper
	*/
	GetPG: function(){
		return pghelper.GetPG();
	},
    /**
     * executes a single query and returns the result
     * @param {string} sql 
     * @param {any[]} args 
     */
	ExecuteSingleQuery: async function(sql, args){
		return await pghelper.ExecuteSingleQuery(sql, args);
    }, 
    
    /**
     * starts a new transaction. CommitTransaction or RollbackTransaction has to be called to end this transaction
     * @returns {Promise<pg.PoolClient>}
     */
	StartTransaction: async function(){
        return await pghelper.StartTransaction();
	}, 
    
    /**
     * will commit all changes in this transaction
     * @param {pg.PoolClient} dbcon 
     */
	CommitTransaction: async function(dbcon){
		return await pghelper.CommitTransaction(dbcon);
    }, 
    
    /**
     * will undo all operations in this transaction
     * @param {pg.PoolClient} dbcon 
     */
	RollbackTransaction: async function(dbcon){
		return await pghelper.RollbackTransaction(dbcon);
	}, 
    
    /**
     * Perform an sql query in a transaction
     * @param {pg.PoolClient} dbcon 
     * @param {string} sql 
     * @param {any[]} args 
     */
	ExecuteQuery: async function(dbcon, sql, args){
		return await pghelper.ExecuteQuery(dbcon, sql, args);
	}
}