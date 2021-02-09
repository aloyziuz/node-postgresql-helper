const pg = require("pg");
const fs = require("fs");
const conf = require("config");
var dbconfig = conf.get("dbConfig");
const pool = new pg.Pool({
    user: dbconfig.username, 
    host: dbconfig.host, 
    database: dbconfig.db, 
    password: dbconfig.password, 
    port: dbconfig.port
});

module.exports = {
	/**
	* gets pg nodule used by the helper
	*/
	GetPG: function(){
		return pg;
	},
    /**
     * executes a single query and returns the result
     * @param {string} sql 
     * @param {any[]} args 
     */
	ExecuteSingleQuery: async function(sql, args){
		var res = await pool.query(sql, args);
		return res;
    }, 
    
    /**
     * starts a new transaction. CommitTransaction or RollbackTransaction has to be called to end this transaction
     * @returns {Promise<pg.PoolClient>}
     */
	StartTransaction: async function(){
        var client = await pool.connect();
        await client.query("BEGIN");
		return client;
	}, 
    
    /**
     * will commit all changes in this transaction
     * @param {pg.PoolClient} dbcon 
     */
	CommitTransaction: async function(dbcon){
		await dbcon.query("COMMIT");
		await dbcon.release();
    }, 
    
    /**
     * will undo all operations in this transaction
     * @param {pg.PoolClient} dbcon 
     */
	RollbackTransaction: async function(dbcon){
		await dbcon.query("ROLLBACK");
		await dbcon.release();
	}, 
    
    /**
     * Perform an sql query in a transaction
     * @param {pg.PoolClient} dbcon 
     * @param {string} sql 
     * @param {any[]} args 
     */
	ExecuteQuery: async function(dbcon, sql, args){
		var res = await dbcon.query(sql, args);
		return res;
	}
}