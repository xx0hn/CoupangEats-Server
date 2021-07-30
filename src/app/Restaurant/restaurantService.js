const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const restaurantProvider = require("./restaurantProvider");
const restaurantDao = require("./restaurantDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

exports.patchReviewHelp = async function (reviewId) {
    try{
        const connection = await pool.getConnection(async(conn)=>conn);
        const updateReviewHelpResult = await restaurantDao.updateReviewHelpNum(connection, reviewId);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch(err) {
        logger.error(`App - updateReviewHelp Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.postRestaurantReview = async function (userId, chargeId, restaurantId, reviewScore, contents, imageUrl) {
    try{
        const connection = await pool.getConnection(async(conn)=>conn);
        const postReviewAtRestaurant = await restaurantDao.addReview(connection, userId, chargeId, restaurantId, reviewScore, contents, imageUrl);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch(err) {
        logger.error(`App - postReview Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}