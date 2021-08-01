const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리
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

//email중복확인
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
exports.passwordCheck = async function (selectUserPasswordParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const passwordCheckResult = await userDao.selectUserPassword(
      connection,
      selectUserPasswordParams
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