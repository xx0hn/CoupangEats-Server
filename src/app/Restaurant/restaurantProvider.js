const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const restaurantDao = require("./restaurantDao");

//전체 카테고리 조회
exports.totalCategory = async function(){
    const connection = await pool.getConnection(async(conn)=>conn);
    const categoryResult = await restaurantDao.selectCategory(connection);
    connection.release();
    return categoryResult;
}

//신규 매장 조회
exports.newRestaurant = async function(){
    const connection = await pool.getConnection(async(conn)=>conn);
    const newRestaurantResult = await restaurantDao.selectNewRestaurant(connection);
    connection.release();
    return newRestaurantResult;
}

//평점 순 매장 조회
exports.reviewRestaurant = async function(){
    const connection = await pool.getConnection(async(conn)=>conn);
    const reviewRestaurantResult = await restaurantDao.selectReviewRestaurant(connection);
    connection.release();
    return reviewRestaurantResult;
}

//카테고리로 매장 조회
exports.restaurantByCategoryId = async function(categoryId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const restaurantByCategoryResult = await restaurantDao.selectRestaurantByCategoryId(connection, categoryId);
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
    return cheetahDeliveryResult;
}

//매장 사진 조회
exports.getCheetahResImageUrl = async function(restaurantId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const resImage = await restaurantDao.selectResImage(connection, restaurantId);
    return resImage;
}