const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const restaurantDao = require("./restaurantDao");

exports.totalCategory = async function(){
    const connection = await pool.getConnection(async(conn)=>conn);
    const categoryResult = await restaurantDao.selectCategory(connection);
    connection.release();
    return categoryResult;
}

exports.newRestaurant = async function(){
    const connection = await pool.getConnection(async(conn)=>conn);
    const newRestaurantResult = await restaurantDao.selectNewRestaurant(connection);
    connection.release();
    return newRestaurantResult;
}

exports.reviewRestaurant = async function(){
    const connection = await pool.getConnection(async(conn)=>conn);
    const reviewRestaurantResult = await restaurantDao.selectReviewRestaurant(connection);
    connection.release();
    return reviewRestaurantResult;
}