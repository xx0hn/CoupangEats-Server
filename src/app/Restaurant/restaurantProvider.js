const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const restaurantDao = require("./restaurantDao");

//신규 순 매장 조회
exports.sortNewRestaurant = async function(){
    const connection = await pool.getConnection(async(conn)=>conn);
    const sortNewRestaurantResult = await restaurantDao.sortNewRestaurant(connection);
    connection.release();
    return sortNewRestaurantResult;
}

//별점 순 매장 조회
exports.sortStarGradeRestaurant = async function(){
    const connection = await pool.getConnection(async(conn)=>conn);
    const sortStarGradeRestaurantResult = await restaurantDao.sortStarGradeRestaurant(connection);
    connection.release();
    return sortStarGradeRestaurantResult;
}

//주문 많은 순 매장 조회
exports.sortOrderCountRestaurant = async function(){
    const connection = await pool.getConnection(async(conn)=>conn);
    const sortOrderCountRestaurantResult = await restaurantDao.sortOrderCountRestaurant(connection);
    connection.release();
    return sortOrderCountRestaurantResult;
}


//검색어로 매장 조회
exports.restaurantByCategoryId = async function(word, words){
    const connection = await pool.getConnection(async(conn)=>conn);
    const restaurantByCategoryResult = await restaurantDao.selectRestaurantByCategoryId(connection, word, words);
    connection.release();
    return restaurantByCategoryResult;
}

//리뷰 조회
exports.getReviews = async function(restaurantId) {
    const connection = await pool.getConnection(async(conn)=>conn);
    const restaurantReview = await restaurantDao.getReviews(connection, restaurantId);
    connection.release();
    return restaurantReview;
}
//주문 음식 조회
exports.getOrdersFood = async function(restaurantId, chargeId) {
    const connection = await pool.getConnection(async (conn)=>conn);
    const orderFoodResult = await restaurantDao.getOrdersFood(connection, restaurantId ,chargeId);
    connection.release();
    return orderFoodResult;
}

//매장 메인 화면 조회 (카테고리만)
exports.getRestaurantMain = async function(restaurantId) {
    const connection = await pool.getConnection(async(conn)=>conn);
    const restaurantMainInfo= await restaurantDao.getRestaurantMainInfo(connection, restaurantId);
    connection.release();
    return restaurantMainInfo;
}

//해당 매장 카테고리 조회
exports.getSmallCategory = async function(restaurantId) {
    const connection = await pool.getConnection(async(conn)=>conn);
    const smallCategory = await restaurantDao.getSmallCategory(connection, restaurantId);
    connection.release();
    return smallCategory;
}

//매장 카테고리의 음식 조회
exports.getMenuInCategory = async function(categoryId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const menuInCategory = await restaurantDao.getMenuInCategory(connection, categoryId);
    connection.release();
    return menuInCategory;
}

//매장 리뷰 조회
exports.getSomeReview = async function(restaurantId) {
    const connection = await pool.getConnection(async(conn)=>conn);
    const someReview = await restaurantDao.getSomeReview(connection, restaurantId);
    connection.release();
    return someReview;
}

//매장 이미지 조회
exports.getRestaurantImageUrl = async function(restaurantId) {
    const connection = await pool.getConnection(async(conn)=>conn);
    const restaurantImageUrl = await restaurantDao.getRestaurantImageUrl(connection, restaurantId);
    connection.release();
    return restaurantImageUrl;
}

//치타배달 매장 조회
exports.cheetahDeliveryRestaurant = async function(){
    const connection = await pool.getConnection(async(conn)=>conn);
    const cheetahDeliveryResult = await restaurantDao.selectCheetahDeliveryRestaurant(connection);
    connection.release();
    return cheetahDeliveryResult;
}

//모든 배달 매장 조회
exports.deliveryRestaurant = async function(){
    const connection = await pool.getConnection(async(conn)=>conn);
    const deliveryResult = await restaurantDao.selectDeliveryRestaurant(connection);
    connection.release();
    return deliveryResult;
}

//매장 사진 조회
exports.getCheetahResImageUrl = async function(restaurantId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const resImage = await restaurantDao.selectResImage(connection, restaurantId);
    connection.release();
    return resImage;
}

//매장 리뷰 전체 정보 조회(사진없는)
exports.getNonPhotoReview = async function(restaurantId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const reviewResult = await restaurantDao.selectNonPhotoReview(connection, restaurantId);
    connection.release();
    return reviewResult;
}

//사진 없는 리뷰 조회
exports.getNonReviews = async function(restaurantId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const nonReviews = await restaurantDao.selectNonReviews(connection, restaurantId);
    connection.release();
    return nonReviews;
}

//사진 없는 리뷰 음식 조회
exports.getOrderedMenu = async function(chargeId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const nonPhotoReviewMenu = await restaurantDao.selectNonPhotoReviewMenu(connection, chargeId);
    connection.release();
    return nonPhotoReviewMenu;
}

//reviewId를 통한 유저 조회
exports.reviewIdCheck = async function(userId, reviewId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const reviewIdCheck = await restaurantDao.selectUserByReviewId(connection, userId, reviewId);
    connection.release();
    return reviewIdCheck;
}

//chargeId를 통한 리뷰 조회
exports.reviewCheck = async function(chargeId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const reviewResult = await restaurantDao.selectReviewByChargeId(connection, chargeId);
    connection.release();
    return reviewResult;
}

//도움됐어요의 상태 확인
exports.helpedStatusCheck = async function(userId, reviewId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const helpedStatusResult = await restaurantDao.selectHelpedStatus(connection, userId, reviewId);
    connection.release();
    return helpedStatusResult;
}

//수정 가능 기간 확인
exports.availablePeriodCheck = async function(userId, reviewId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const PeriodCheck = await restaurantDao.selectReviewByPeriod(connection, userId, reviewId);
    return PeriodCheck;
}

//도움 안됨을 이미 추가했는지 확인
exports.userCheck = async function(userId, reviewId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const userCheck = await restaurantDao.selectNotHelpedByUser(connection, userId, reviewId);
    return userCheck;
}

//도움 안됨의 상태 확인
exports.notHelpedCheck = async function(userId, reviewId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const notHelpedCheck = await restaurantDao.selectNotHelpedStatus(connection, userId, reviewId);
    return notHelpedCheck;
}
