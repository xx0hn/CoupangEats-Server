const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const addressDao = require("./addressDao");

exports.retrieveAddress = async function(userId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const addressResult = await addressDao.selectAddress(connection, userId);
    connection.release();

    return addressResult;
}