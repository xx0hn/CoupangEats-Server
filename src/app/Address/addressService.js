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
exports.additAddress = async function(userId, roadAddress, detailAddress, roadNavigate, latitude, longtitude, setStatus){
    const connection = await pool.getConnection(async (conn) => conn);
   try {
       await connection.beginTransaction();
       if(setStatus === 'HOME') {
           const checkHomeAddress = await addressProvider.checkHomeAddress(userId, setStatus);
           if (checkHomeAddress.length > 0) {
               const homeAddressNot = await addressDao.homeAddressNot(connection, userId, setStatus);
           }
       }
       else if(setStatus === 'COMPANY') {
           const checkHomeAddress = await addressProvider.checkHomeAddress(userId, setStatus);
           if (checkHomeAddress.length > 0) {
               const homeAddressNot = await addressDao.homeAddressNot(connection, userId, setStatus);
           }
       }
       const additAddressResult = await addressDao.additAddressInfo(connection, userId, roadAddress, detailAddress, roadNavigate, latitude, longtitude, setStatus);
       await connection.commit();
       return response(baseResponse.SUCCESS);
   } catch(err) {
       await connection.rollback();
       logger.error(`App - addAddress Service Transaction error\n: ${err.message}`);
       return errResponse(baseResponse.DB_ERROR);
   } finally {
       connection.release();
   }
}

//기본 배송지로 설정
exports.setDefaultAddress = async function(userId, addressId) {
    const connection = await pool.getConnection(async(conn)=>conn);
    try {
        await connection.beginTransaction();
        const defaultAddressSetting = await addressDao.defaultAddressSetting(connection, userId);
        const defaultAddressResult = await addressDao.defaultAddressInfo(connection, userId, addressId);
        await connection.commit();
        return response(baseResponse.SUCCESS);
    } catch(err){
        logger.error(`App - defaultAddress Service Transaction error\n: ${err.message}`);
        await connection.rollback();
        return errResponse(baseResponse.DB_ERROR);
    }
    finally{
        connection.release();
    }
}