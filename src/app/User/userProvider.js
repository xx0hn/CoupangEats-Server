const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리

//유저가 작성한 리뷰 조회
exports.getUserReview = async function (userId, restaurantId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const getUserReviewResult = await userDao.selectUserReviews(connection, userId, restaurantId);
  connection.release();
  return getUserReviewResult;
}

//리뷰의 메뉴 조회
exports.getMenuInfo = async function (userId, reviewId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const getMenuInfo = await userDao.selectMenuInfo(connection, userId, reviewId);
  connection.release();
  return getMenuInfo;
}

//email로 유저 조회
exports.retrieveUserList = async function (email) {
  if (!email) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUser(connection);
    connection.release();

    return userListResult;

  } else {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUserEmail(connection, email);
    connection.release();

    return userListResult;
  }
};
//userId로 회원조회
exports.retrieveUser = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectUserId(connection, userId);

  connection.release();

  return userResult[0];
};

//매장 중복 확인
exports.restaurantIdCheck = async function(userId, restaurantId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const restaurantIdCheckResult = await userDao.selectUserRestaurantId(connection,userId, restaurantId);
  connection.release();

  return restaurantIdCheckResult;
}

//email 중복확인
exports.emailCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await userDao.selectUserEmail(connection, email);
  connection.release();

  return emailCheckResult;
};

//전화번호 중복확인
exports.phoneNumCheck = async function (phoneNum){
  const connection = await pool.getConnection(async(conn)=>conn);
  const phoneNumCheckResult = await userDao.selectUserPhoneNum(connection, phoneNum);
  connection.release();

  return phoneNumCheckResult;
}

//비밀번호 확인
exports.passwordCheck = async function (selectUserParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const passwordCheckResult = await userDao.selectUserPassword(
      connection,
      selectUserParams
  );
  connection.release();
  return passwordCheckResult[0];
};

//유저 계정 상태 체크
exports.accountCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAccountResult = await userDao.selectUserAccount(connection, email);
  connection.release();

  return userAccountResult;
};

//즐겨찾기 조회
exports.getFavoritesList = async function(userId) {
  const connection = await pool.getConnection(async(conn)=>conn);
  const favoritesResult = await userDao.selectFavoritesList(connection, userId);
  connection.release();
  return favoritesResult;
}

//지난 주문 내역 조회
exports.pastOrderList = async function (userId) {
  const connection = await pool.getConnection(async(conn)=>conn);
  const pastOrderResult = await userDao.selectPastOrder(connection, userId);
  connection.release();
  return pastOrderResult;
}
// 과거 주문 내역 조회(상품 제외 조회)
exports.getOrdersInfo = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const ordersResult = await userDao.getOrdersInfo(connection, userId);
  connection.release();

  return ordersResult;
};
// 과거 주문 내역 조회(상품 조회)
exports.getOrderFoods = async function (userId, orderId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const orderFoodsResult = await userDao.getOrderFoods(connection, userId, orderId);
  connection.release();

  return orderFoodsResult;
};
// 과거 주문 내역 조회(총 가격)
exports.getTotalPrice = async function (userId, orderId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const totalPriceResult = await userDao.getTotalPrice(connection, userId, orderId);
  connection.release();

  return totalPriceResult;
};

//검색 순위 조회
exports.searchRankInfo = async function(){
  const connection = await pool.getConnection(async(conn)=>conn);
  const getSearchRank = await userDao.selectSearchRank(connection);
  connection.release();
  return getSearchRank;
}

//영수증 정보 조회
exports.getReceiptsInfo = async function(userId, chargeId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const getReceiptsInfo = await userDao.selectReceiptsInfo(connection, userId, chargeId);
  return getReceiptsInfo;
}

//영수증 메뉴 조회
exports.getReceiptsMenu = async function(chargeId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const getReceiptsMenu = await userDao.selectReceiptsMenu(connection, chargeId);
  return getReceiptsMenu;
}

//영수증 총 가격 조회
exports.getReceiptsPrice = async function(chargeId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const getReceiptsPrice = await userDao.selectReceiptsPrice(connection, chargeId);
  return getReceiptsPrice;
}

//사용자 카드 조회
exports.getCardList = async function(userId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const getUserCard = await userDao.selectUserCardList(connection, userId);
  connection.release();
  return getUserCard;
}

//사용자 카드번호로 사용자 조회
exports.cardNumCheck = async function(userId, bankId, cardNum){
  const connection = await pool.getConnection(async(conn)=>conn);
  const userCardNum = await userDao.selectUserCardNum(connection, userId, bankId, cardNum);
  connection.release();
  return userCardNum;
}
