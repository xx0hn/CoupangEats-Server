const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const restaurantProvider = require("./restaurantProvider");
const restaurantDao = require("./restaurantDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const schedule = require('node-schedule');

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

//도움 취소
exports.cancelHelped = async function (userId, reviewId){
    try{
        const connection = await pool.getConnection(async(conn)=>conn);
        const cancelHelped = await restaurantDao.cancelHelped(connection, userId, reviewId);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch(err){
        logger.error(`App - patchReviewHelped Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

}

//리뷰 도움 횟수 증가
exports.patchReviewHelp = async function (userId, reviewId) {
    const connection = await pool.getConnection(async(conn)=>conn);
    try{
        await connection.beginTransaction();
        const reviewIdCheck = await restaurantProvider.reviewIdCheck(userId, reviewId);
        if(reviewIdCheck.length>0){
            const helpedStatus = await restaurantProvider.helpedStatusCheck(userId, reviewId);
            if(helpedStatus.length>0){
                const changeHelpedStatus = await restaurantDao.changeHelpedStatus(connection, userId, reviewId);
                await connection.commit();
                return response(baseResponse.SUCCESS);
            }
            else{
                return response(errResponse(baseResponse.REDUNDANT_HELPED_REVIEWID));
            }
        }
        const updateReviewHelpResult = await restaurantDao.updateReviewHelpNum(connection, userId, reviewId);
        await connection.commit();
        return response(baseResponse.SUCCESS);
    } catch(err) {
        logger.error(`App - postReviewHelp Service Transaction error\n: ${err.message}`);
        await connection.rollback();
        return errResponse(baseResponse.DB_ERROR);
    }
    finally {
        connection.release();
    }
}

//리뷰 작성
exports.postRestaurantReview = async function (userId, chargeId, restaurantId, reviewScore, contents, imageUrl) {
    try{
        const reviewCheck = await restaurantProvider.reviewCheck(chargeId);
        if(reviewCheck.length>0){
            return response(errResponse(baseResponse.REDUNDANT_CHARGE_ID_REVIEW));
        }
        const connection = await pool.getConnection(async(conn)=>conn);
        const postReviewAtRestaurant = await restaurantDao.addReview(connection, userId, chargeId, restaurantId, reviewScore, contents, imageUrl);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch(err) {
        logger.error(`App - postReview Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//리뷰 수정
exports.updateReview = async function (userId, reviewScore, contents, imageUrl, reviewId) {
    const connection = await pool.getConnection(async(conn)=>conn);
    try{
        await connection.beginTransaction();
        const availablePeriodCheck = await restaurantProvider.availablePeriodCheck(userId, reviewId);
        if(availablePeriodCheck.length>0){
            return response(errResponse(baseResponse.CANNOT_UPDATE_REVIEW));
        }
        const updateReviewByReviewId = await restaurantDao.updateRestaurantReview(connection,reviewScore, contents, imageUrl, reviewId);
        await connection.commit();
        return response(baseResponse.SUCCESS);
    } catch(err){
        logger.error(`App - updateReview Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
    finally{
        connection.release();
    }
}

//리뷰 도움안됨 증가
exports.notHelped = async function (userId, reviewId){
    try{
        const userCheck = await restaurantProvider.userCheck(userId, reviewId);
        if(userCheck.length>0){
            const notHelpedCheck = await restaurantProvider.notHelpedCheck(userId, reviewId);
            if(notHelpedCheck.length>0){
                const connection = await pool.getConnection(async(conn)=>conn);
                const changeNotHelpedStatus = await restaurantDao.changeNotHelpedStatus(connection,userId, reviewId);
                connection.release();
                return response(baseResponse.SUCCESS);
            }
            else
            {
                return response(errResponse(baseResponse.REDUNDANT_NOT_HELPED_REVIEW));
            }
        }
        const connection = await pool.getConnection(async(conn)=>conn);
        const addNotHelped = await restaurantDao.addNotHelped(connection, userId, reviewId);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch(err){
        logger.error(`App - postNotHelped Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//리뷰 도움안됨 여부 취소
exports.cancelNotHelped = async function(userId, reviewId){
    try{
        const connection = await pool.getConnection(async(conn)=>conn);
        const cancelNotHelped = await restaurantDao.cancelNotHelped(connection, userId, reviewId);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch(err){
        logger.error(`App - patchNotHelped Service error\n :${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}