const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const addressProvider = require("./addressProvider");
const addressDao = require("./addressDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

//배송지 삭제
exports.rmAddress = async function(userId, addressId){
    try{
        console.log(userId)
        const connection = await pool.getConnection(async (conn)=>conn);
        const rmAddressResult = await addressDao.rmAddressInfo(connection, userId, addressId);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch(err) {
        logger.error(`App - removeAddress Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//배송지 추가
exports.additAddress = async function(userId, roadAddress, detailAddress){
   try {
       const connection = await pool.getConnection(async (conn) => conn);
       const additAddressResult = await addressDao.additAddressInfo(connection, userId, roadAddress, detailAddress);
       connection.release();

       return response(baseResponse.SUCCESS);
   } catch(err) {
       logger.error(`App - addAddress Service error\n: ${err.message}`);
       return errResponse(baseResponse.DB_ERROR);
   }
}

//기본 배송지로 설정
exports.setDefaultAddress = async function(userId, addressId) {
    try {
        const connection = await pool.getConnection(async(conn)=>conn);
        const defaultAddressResult = await addressDao.defaultAddressInfo(connection, userId, addressId);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch(err){
        logger.error(`App - defaultAddress Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}