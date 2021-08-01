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
/**
 * API No. 12
 * API Name : 매장 검색 API
 * [GET] /app/restaurant/category/:categoryId
 */
exports.categorySearch = async function (req, res) {
    const categoryId = req.params.categoryId;
    if(!categoryId) return res.response(baseResponse.CATEGORY_ID_EMPTY);
    const getRestaurantByCategoryId = await restaurantProvider.restaurantByCategoryId(categoryId);
    return res.send(response(baseResponse.SUCCESS, getRestaurantByCategoryId));
}
/**
 * API No. 13
 * API Name : 리뷰 도움 여부 증가 API
 * [PATCH] /app/restaurant/review/help
 */
exports.giveHelpReview = async function (req,res) {
    const {reviewId} = req.body;
    if(!reviewId) return res.response(baseResponse.REVIEW_ID_EMPTY);
    const updateReviewHelp = await restaurantService.patchReviewHelp(reviewId);
    return res.send(response(updateReviewHelp));
}
/**
 * API No. 14
 * API Name : 매장 리뷰 생성 API
 *[POST] /app/restaurant/review
 */
exports.addReview = async function (req, res) {
    const {userId, chargeId, restaurantId, reviewScore, contents, imageUrl} =req.body;

    if(!userId) return res.response(baseResponse.USER_USERID_EMPTY);

    if(!chargeId) return res.response(baseResponse.CHARGE_ID_EMPTY);

    if(!restaurantId) return res.response(baseResponse.RESTAURANT_ID_EMPTY);

    if(!reviewScore) return res.response(baseResponse.REVIEW_SCORE_EMPTY);
    if(reviewScore>5||reviewScore<1) return res.response(baseResponse.REVIEW_SCORE_SIZE);

    if(!contents) return res.response(baseResponse.REVIEW_CONTENTS_EMPTY);

    const postReview = await restaurantService.postRestaurantReview(userId, chargeId, restaurantId, reviewScore, contents, imageUrl);
    return res.send(response(postReview));
}
/**
 * API No. 15
 * API Name : 매장 리뷰 수정 API
 *[PATCH] /app/restaurant/review
 */
exports.editReview = async function(req, res){

    const {reviewScore, contents, imageUrl, reviewId} = req.body;

    if(!reviewId) return res.response(baseResponse.REVIEW_ID_EMPTY);

    if(!reviewScore) return res.response(baseResponse.REVIEW_SCORE_EMPTY);
    if(reviewScore>5||reviewScore<1) return res.response(baseResponse.REVIEW_SCORE_SIZE);

    if(!contents) return res.response(baseResponse.REVIEW_CONTENTS_EMPTY);

    const editRestaurantReview = await restaurantService.updateReview( reviewScore, contents, imageUrl, reviewId);
    return res.send(response(editRestaurantReview));
}
/**
 * API No. 16
 * API Name : 사진 있는 매장 리뷰 상세 조회 API
 *[GET] /app/restaurant/:restaurantId/photoReview
 */
exports.getReview = async function (req, res){
    const restaurantId = req.params.restaurantId;
    const reviewsInfo = await restaurantProvider.getReviews(restaurantId);
    console.log(reviewsInfo)
    const result= [];
    if(!restaurantId) return res.response(baseResponse.RESTAURANT_ID_EMPTY);
    for(let i=0; i<reviewsInfo.length; i++){
        const orderFoods = await restaurantProvider.getOrdersFood(restaurantId, reviewsInfo[i].id);
        result.push({reviewsInfo: reviewsInfo[i], orderFoods: orderFoods});
    }
    return res.send(response(baseResponse.SUCCESS, result));
}

/**
 * API No. 19
 * API Name : 매장 메인 화면 조회 API
 *[GET] /app/restaurant/:restaurantId/main
 */
exports.restaurantMain = async function(req, res){
    const restaurantId = req.params.restaurantId;
    const restaurantMain = await restaurantProvider.getRestaurantMain(restaurantId);
    const menuCategory = await restaurantProvider.getSmallCategory(restaurantId);
    const restaurantReview = await restaurantProvider.getSomeReview(restaurantId);
    const restaurantImageUrl = await restaurantProvider.getRestaurantImageUrl(restaurantId);
    const result = [];
    if(!restaurantId) return res.response(baseResponse.RESTAURANT_ID_EMPTY);
    for(let i=0; i<menuCategory.length; i++){
        const MenuInCategory = await restaurantProvider.getMenuInCategory(menuCategory[i].id);
        result.push({SmallCategory: menuCategory[i], MenuInCategory: MenuInCategory});
    }
    restaurantMain.push({RestaurantImages:restaurantImageUrl});
    restaurantMain.push({SomeReviews:restaurantReview});
    restaurantMain.push(result);
    return res.send(response(baseResponse.SUCCESS, restaurantMain));
}

/**
 * API No. 21
 * API Name : 치타배달 매장 조회 API
 *[GET] /app/restaurant/cheetah
 */
exports.cheetahRestaurant = async function(req, res){
    const cheetahDeliveryRes = await restaurantProvider.cheetahDeliveryRestaurant();
    const result = [];
    for(let i =0; i<cheetahDeliveryRes.length; i++){
        const cheetahResImage = await restaurantProvider.getCheetahResImageUrl(cheetahDeliveryRes[i].id);
        result.push({restaurantInfo: cheetahDeliveryRes[i], restaurantImageUrl: cheetahResImage});
    }
    return res.send(response(baseResponse.SUCCESS, result));
}