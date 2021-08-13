const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const addressDao = require("./addressDao");

//유저의 배송지 목록 조회
exports.retrieveAddress = async function(userId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const addressResult = await addressDao.selectAddress(connection, userId);
    connection.release();

    return addressResult;
}

//setStatus가 같은 것이 있는지 확인
exports.checkHomeAddress = async function(userId, setStatus){
    const connection = await pool.getConnection(async(conn)=>conn);
    const homeAddressResult = await addressDao.selectHomeAddress(connection, userId, setStatus);
    connection.release();
    return homeAddressResult;
}

