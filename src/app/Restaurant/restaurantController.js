const jwtMiddleware = require("../../../config/jwtMiddleware");
const restaurantProvider = require("../../app/Restaurant/restaurantProvider");
const restaurantService = require("../../app/Restaurant/restaurantService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require('regex-email');
const { emit } = require('nodemon');




/**
 * API No. 3
 * API Name : 매장 우선순위 정렬 조회 API
 * [GET] /app/restaurants
 */
exports.sortRestaurant = async function(req, res){
    const {priority} = req.query;
    const result = [];
    if(!priority) return res.response(baseResponse.PRIORITY_EMPTY);
    if(priority==='NEW'){
        const sortNewRestaurant = await restaurantProvider.sortNewRestaurant();
        for(let i=0; i<sortNewRestaurant.length; i++){
            const restaurantImageUrl = await restaurantProvider.getRestaurantImageUrl(sortNewRestaurant[i].id);
            result.push({RestaurantInfo: sortNewRestaurant[i], RestaurantImageUrl: restaurantImageUrl});
        }
        return res.send(response(baseResponse.SUCCESS, result));
    }
    else if(priority==='STARGRADE'){
        const sortStarGradeRestaurant = await restaurantProvider.sortStarGradeRestaurant();
        for(let i=0; i<sortStarGradeRestaurant.length; i++){
            const restaurantImageUrl = await restaurantProvider.getRestaurantImageUrl(sortStarGradeRestaurant[i].id);
            result.push({RestaurantInfo: sortStarGradeRestaurant[i], RestaurantImageUrl: restaurantImageUrl});
        }
        return res.send(response(baseResponse.SUCCESS, result));
    }
    else if(priority==='ORDERCOUNT'){
        const sortOrderCountRestaurant = await restaurantProvider.sortOrderCountRestaurant();
        for(let i=0; i<sortOrderCountRestaurant.length; i++){
            const restaurantImageUrl = await restaurantProvider.getRestaurantImageUrl(sortOrderCountRestaurant[i].id);
            result.push({RestaurantInfo: sortOrderCountRestaurant[i], RestaurantImageUrl: restaurantImageUrl});
        }
        return res.send(response(baseResponse.SUCCESS, result));
    }
    else {
        return res.send(response(baseResponse.PRIORITY_ERROR_TYPE));
    }
}

/**
 * API No. 4
 * API Name : 매장 우선순위 정렬 조회 API
 * [PATCH] /app/users/{userId}/helped-review
 */
exports.cancelHelped = async function(req, res){
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {reviewId} = req.body;
    if(!userId) return res.response(baseResponse.USER_USERID_EMPTY);
    if(userIdFromJWT!=userId){
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }
    if(!reviewId) return res.response(baseResponse.REVIEW_ID_EMPTY);
    const cancelHelped = await restaurantService.cancelHelped(userId, reviewId);
    return res.send(response(cancelHelped));
}


/**
 * API No. 12
 * API Name : 매장 검색 API
 * [GET] /app/search-words
 */
exports.categorySearch = async function (req, res) {
    const {word} = req.query;
    const words = word;
    const result = [];
    const getRestaurantByCategoryId = await restaurantProvider.restaurantByCategoryId(word, words);
    if(!word) return res.response(baseResponse.SEARCH_WORD_EMPTY);
    for(let i=0; i<getRestaurantByCategoryId.length; i++){
        const restaurantImageUrl = await restaurantProvider.getRestaurantImageUrl(getRestaurantByCategoryId[i].RestaurantId);
        result.push({RestaurantInfo: getRestaurantByCategoryId[i], RestaurantImageUrl: restaurantImageUrl});
    }
    return res.send(response(baseResponse.SUCCESS, result));
}
/**
 * API No. 13
 * API Name : 리뷰 도움 여부 증가 API
 * [POST] /app/users/{userId}/helped-review
 */
exports.giveHelpReview = async function (req,res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {reviewId} = req.body;
    if(!userId) return res.response(baseResponse.USER_USERID_EMPTY);
    if(userIdFromJWT!=userId){
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }
    if(!reviewId) return res.response(baseResponse.REVIEW_ID_EMPTY);
    const updateReviewHelp = await restaurantService.patchReviewHelp(userId, reviewId);
    return res.send(response(updateReviewHelp));
}
/**
 * API No. 14
 * API Name : 매장 리뷰 생성 API
 *[POST] /app/users/{userId}/reviews
 */
exports.addReview = async function (req, res) {
    const userIdFromJTW = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {chargeId, restaurantId, reviewScore, contents, imageUrl} =req.body;

    if(!userId) return res.response(baseResponse.USER_USERID_EMPTY);
    if(userIdFromJTW!=userId){
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }
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
 *[PATCH] /app/users/{userId}/reviews
 */
exports.editReview = async function(req, res){
    const userIdFromJWT = req.verifiedToken.userId;
    const userId =req.params.userId;
    const {reviewScore, contents, imageUrl, reviewId} = req.body;
    if(!userId) return res.response(baseResponse.USER_USERID_EMPTY);
    if(userIdFromJWT!=userId){
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }
    if(!reviewId) return res.response(baseResponse.REVIEW_ID_EMPTY);
    if(!reviewScore) return res.response(baseResponse.REVIEW_SCORE_EMPTY);
    if(reviewScore>5||reviewScore<1) return res.response(baseResponse.REVIEW_SCORE_SIZE);
    if(!contents) return res.response(baseResponse.REVIEW_CONTENTS_EMPTY);

    const editRestaurantReview = await restaurantService.updateReview(userId, reviewScore, contents, imageUrl, reviewId);
    return res.send(response(editRestaurantReview));
}
/**
 * API No. 16
 * API Name : 매장 리뷰 상세 조회 API
 *[GET] /app/restaurant/:restaurantId/reviews
 */
exports.getReview = async function (req, res){
    const restaurantId = req.params.restaurantId;
    const {type} = req.query;
    if(!restaurantId) return res.response(baseResponse.RESTAURANT_ID_EMPTY);
    if(!type) return res.response(baseResponse.REVIEW_TYPE_EMPTY);
    if(type==='PHOTO') {
        const reviewsInfo = await restaurantProvider.getReviews(restaurantId);
        const result= [];
        for (let i = 0; i < reviewsInfo.length; i++) {
            const orderFoods = await restaurantProvider.getOrdersFood(restaurantId, reviewsInfo[i].id);
            result.push({reviewsInfo: reviewsInfo[i], orderFoods: orderFoods});
        }
        return res.send(response(baseResponse.SUCCESS, result));
    }
    else if(type==='NON-PHOTO'){
        const getNonPhotoReview = await restaurantProvider.getNonPhotoReview(restaurantId);
        const getReviews = await restaurantProvider.getNonReviews(restaurantId);
        const result = [];
        for(let i=0; i<getReviews.length; i++){
            const getOrderedMenu = await restaurantProvider.getOrderedMenu(getReviews[i].id);
            result.push({reviewsInfo: getReviews[i], orderFoods: getOrderedMenu});
        }
        getNonPhotoReview.push(result);
        return res.send(response(baseResponse.SUCCESS, getNonPhotoReview));
    }
    else{
        return res.send(response(baseResponse.REVIEW_TYPE_NOT_MATCH));
    }
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
 * API Name : 배달 유형 별 매장 조회 API
 *[GET] /app/restaurant/cheetah
 */
exports.cheetahRestaurant = async function(req, res){
    const {deliveryType} = req.query;
    const result=[];
    if(!deliveryType) return res.send(baseResponse.DELIVERY_TYPE_EMPTY);
    if(deliveryType==='CHEETAH') {
        const cheetahDeliveryRes = await restaurantProvider.cheetahDeliveryRestaurant();
        for (let i = 0; i < cheetahDeliveryRes.length; i++) {
            const cheetahResImage = await restaurantProvider.getCheetahResImageUrl(cheetahDeliveryRes[i].id);
            result.push({restaurantInfo: cheetahDeliveryRes[i], restaurantImageUrl: cheetahResImage});
        }
        return res.send(response(baseResponse.SUCCESS, result));
    }
    else if(deliveryType==='ALL'){
        const deliveryRes = await restaurantProvider.deliveryRestaurant();
        for(let i=0; i<deliveryRes.length; i++){
            const resImage = await restaurantProvider.getCheetahResImageUrl(deliveryRes[i].id);
            result.push({restaurantInfo: deliveryRes[i], restaurantImageUrl: resImage});
        }
        return res.send(response(baseResponse.SUCCESS, result));
    }
    else return res.send(response(baseResponse.DELIVERY_TYPE_NOT_MATCH));
}


/**
 * API No. 23
 * API Name : 리뷰 도움안됨 추가 API
 *[POST] /app/users/{userId}/not-helped
 */
exports.notHelped = async function(req,res){
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {reviewId} = req.body;
    if(!userId) return res.response(baseResponse.USER_USERID_EMPTY);
    if(userIdFromJWT!=userId){
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }
    if(!reviewId) return res.response(baseResponse.REVIEW_ID_EMPTY);
    const notHelped = await restaurantService.notHelped(userId, reviewId);
    return res.send(response(notHelped));
}

/**
 * API No. 24
 * API Name : 리뷰 도움안됨 취소 API
 *[PATCH] /app/users/{userId}/not-helped
 */
exports.cancelNotHelped = async function(req, res){
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {reviewId} = req.body;
    if(!userId) return res.response(baseResponse.USER_USERID_EMPTY);
    if(userIdFromJWT!=userId){
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }
    if(!reviewId) return res.response(baseResponse.REVIEW_ID_EMPTY);
    const cancelNotHelped = await restaurantService.cancelNotHelped(userId, reviewId);
    return res.send(response(cancelNotHelped));
}

/**
 * API No. 30
 * API Name : 매장 정보 조회 API
 *[GET] /app/restaurants/{restaurantId}/info
 */
exports.getRestaurantInfo = async function(req, res){
    const restaurantId = req.params.restaurantId;
    if(!restaurantId) return res.response(baseResponse.RESTAURANT_ID_EMPTY);
    const getRestaurantInfo = await restaurantProvider.getRestaurantInfo(restaurantId);
    return res.send(response(baseResponse.SUCCESS, getRestaurantInfo));
}