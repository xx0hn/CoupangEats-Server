const jwtMiddleware = require("../../../config/jwtMiddleware");
const restaurantProvider = require("../../app/Restaurant/restaurantProvider");
const restaurantService = require("../../app/Restaurant/restaurantService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require('regex-email');
const { emit } = require('nodemon');

/**
 * API No. 2
 * API Name : 카테고리 조회 API
 * [GET] /app/category
 */
exports.viewCategory = async function(req,res) {
    const getCategory = await restaurantProvider.totalCategory();
    return res.send(response(baseResponse.SUCCESS, getCategory));
}

/**
 * API No. 3
 * API Name : 신규 매장 순 조회 API
 * [GET] /app/restaurant/sort/new
 */
exports.sortNewRestaurant = async function(req, res) {
    const getNewRestaurant = await restaurantProvider.newRestaurant();
    return res.send(response(baseResponse.SUCCESS, getNewRestaurant));
}

/**
 * API No. 4
 * API Name : 평점 순 매장 조회 API
 * [GET] /app/restaurant/sort/review
 */
exports.sortReviewRestaurant = async function(req, res) {
    const getReviewRestaurant = await restaurantProvider.reviewRestaurant();
    return res.send(response(baseResponse.SUCCESS, getReviewRestaurant));
}