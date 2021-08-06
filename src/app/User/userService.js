const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리


exports.editUser = async function (id, nickname) {
    try {
        console.log(id)
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updateUserInfo(connection, id, nickname)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//즐겨찾기 추가
exports.addFavoriteList = async function (userId, restaurantId) {
    try{
        //사용자가 해당 매장을 이미 추가했는지 확인
        const restaurantRows = await userProvider.restaurantIdCheck(userId, restaurantId);
        if(restaurantRows.length>0){
            return errResponse(baseResponse.REDUNDANT_RESTAURANT_ID);
        }
        const connection = await pool.getConnection(async(conn)=>conn);
        const addFavoriteResList = await userDao.additFavoriteList(connection, userId, restaurantId);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch(err){
        logger.error(`App - addFavorites Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
//즐겨찾기 삭제
exports.deleteFavorite = async function (userId, favoritesId){
    try{
        const connection = await pool.getConnection(async(conn)=>conn);
        const editFavoritesList = await userDao.updateFavoritesList(connection,userId, favoritesId);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch(err){
        logger.error(`App - editFavorites Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
//유저 생성
exports.makeUser = async function (email, password, name, phoneNum) {
    try {
        // 이메일 중복 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");
        //전화번호 중복 확인
        const phoneNumRows = await userProvider.phoneNumCheck(phoneNum);
        if(phoneNumRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_PHONENUM);


        const insertUserInfoParams = [email, hashedPassword, name, phoneNum];

        const connection = await pool.getConnection(async (conn) => conn);

        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        console.log(`추가된 회원 : ${userIdResult[0].insertId}`)
        connection.release();
        return response(baseResponse.SUCCESS);


    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
// TODO: After 로그인 인증 방법 (JWT)
//유저 로그인 (JWT)
exports.postUserSignIn = async function (email, password) {
    try {
        // 이메일 여부 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);
        const selectEmail = emailRows[0].email
        // 비밀번호 확인
        const hashedPassword = await crypto
            .createHash('sha512')
            .update(password)
            .digest('hex');
        const selectUserPasswordParams = [selectEmail, hashedPassword];
        const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);
        if(passwordRows.length<1){
            return errResponse((baseResponse.SIGNIN_PASSWORD_WRONG));
        }
        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(email);
        if (userInfoRows[0].status === 'INACTIVE') {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (userInfoRows[0].status === 'DELETED') {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }

        console.log(userInfoRows[0].id) // DB의 userId

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userId: userInfoRows[0].id,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "userInfo",
            } // 유효 기간 365일
        );
        return response(baseResponse.SUCCESS, {'userId': userInfoRows[0].id, 'jwt': token});
    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};




//사용자 카드 등록
exports.postCardList = async function (userId, bankId, cardNum){
    try{
        const cardNumRows = await userProvider.cardNumCheck(userId, bankId, cardNum);
        if(cardNumRows.length>0){
            return errResponse(baseResponse.REDUNDANT_CARD_NUM);
        }
        const connection = await pool.getConnection(async(conn)=>conn);
        const addCardList = await userDao.postUserCard(connection, userId, bankId, cardNum);
        connection.release();
        return response(baseResponse.SUCCESS);
    }catch(err){
        logger.error(`App - postUserCard Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//사용자 카드 삭제
exports.patchCard = async function (cardId){
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const deleteCard = await userDao.patchUserCard(connection, cardId);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch(err){
        logger.error(`App - patchUserCard Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//카카오 소셜 회원 가입
exports.createSocialUser = async function (name, email, loginStatus) {
    try {
        // email 중복 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length > 0) return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

        const insertSocialUserInfoParams = [name, email, loginStatus];

        const connection = await pool.getConnection(async (conn) => conn);

        const userIdResult = await userDao.insertSocialUserInfo(
            connection,
            insertSocialUserInfoParams,
        );
        const userInfoRows = await userProvider.accountCheck(email);
        if (userInfoRows[0].status === 'INACTIVE') {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (userInfoRows[0].status === 'DELETED') {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }
        console.log(`추가된 회원 : ${userIdResult[0].insertId}`);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};