const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const regexEmail = require("regex-email");
const {emit} = require("nodemon");
const axios = require('axios');
const secret_config = require('../../../config/secret');
const jwt = require('jsonwebtoken');
const { logger } = require('../../../config/winston');
const baseResponseStatus = require('../../../config/baseResponseStatus');
// const admin = require('firebase-admin');
// const pwdRegExp = /^.*(?=.{6,20})(?=.*[0-9])(?=.*[a-zA-Z]).*$/; // 비밀번호 정규표현식, 6~20 자 이내 숫자 + 영문
// const nicknameRegExp = /^.*(?=.{2,15})(?=.*[0-9])(?=.*[a-zA-Z]).*$/; // 2~15 자 이내 숫자 + 영문




/**
 * API No. 2
 * API Name : 유저가 작성한 리뷰 조회 API
 * [GET] /app/users/{userId}/review
 */
exports.getUserReview = async function(req, res){
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {restaurantId} = req.body;
    const result = [];
    if(!userId) return res.send(baseResponse.USER_USERID_EMPTY);
    if(userIdFromJWT != userId){
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }
    if(!restaurantId) return res.send(baseResponse.RESTAURANT_ID_EMPTY);

    const getUserReview = await userProvider.getUserReview(userId, restaurantId);
    for(let i=0; i<getUserReview.length; i++){
        const getMenuInfo = await userProvider.getMenuInfo(userId, getUserReview[i].id);
        result.push({ReviewInfo: getUserReview[i], MenuInfo: getMenuInfo});
    }
    return res.send(response(baseResponse.SUCCESS, result));
}




/**
 * API No. 8
 * API Name : 즐겨찾기 조회 API
 * [GET] /app/users/{userId}/favorites
 */
exports.getFavorite = async function(req, res){
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    if(!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    if(userIdFromJWT != userId){
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }
    else {
        const getFavoritesByUserId = await userProvider.getFavoritesList(userId);
        return res.send(response(baseResponse.SUCCESS, getFavoritesByUserId));
    }
}
/**
 * API No. 9
 * API Name : 즐겨찾기 항목 삭제 API
 * [PATCH] /app/users/{userId}/favorites
 */
exports.removeFavorite = async function(req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const favorites = req.body;
    if(!userId) return res.response(baseResponse.USER_USERID_EMPTY);
    if(userIdFromJWT!=userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }
    if(!favorites) return res.response(baseResponse.RESTAURANT_ID_EMPTY);
    else {
        for(let i=0; i<favorites.length; i++){
            const deleteFavorite = await userService.deleteFavorite(userId, favorites[i].favorites);
        }
    }
    return res.send(response(baseResponse.SUCCESS));
}
/**
 * API No. 10
 * API Name : 즐겨찾기 항목 추가 API
 * [POST] /app/users/{userId}/favorites
 */
exports.addFavorite = async function(req, res){
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {restaurantId} = req.body;
    if(!userId) return res.response(baseResponse.USER_USERID_EMPTY);
    if(userIdFromJWT != userId){
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }
    if(!restaurantId) return res.response(baseResponse.RESTAURANT_ID_EMPTY);

    const addFavoriteRestaurant = await userService.addFavoriteList(userId, restaurantId);
    return res.send(response(addFavoriteRestaurant));
}

/**
 * API No. 11
 * API Name : 과거 주문내역 조회 API
 * [GET] /app/users/{userId}/past-order
 */
exports.getPastOrders = async function(req, res){
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    if(!userId) return res.response(baseResponse.USER_USERID_EMPTY);
    if(userIdFromJWT!=userId){
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }
    const orderInfo = await userProvider.getOrdersInfo(userId);
    const result = [];
    for (let i = 0; i < orderInfo.length; i++) {
        const orderFoods = await userProvider.getOrderFoods(userId, orderInfo[i].id); //orderInfo[i][0].id : chargeId
        const totalPrice = await userProvider.getTotalPrice(userId, orderInfo[i].id);
        result.push({ orderInfo: orderInfo[i], orderFoods: orderFoods, totalPrice: totalPrice[0] });
    }
    return res.send(response(baseResponse.SUCCESS, result));
}

/**
 * API No. 17
 * API Name : 회원가입 API
 * [POST] /app/signUp
 */
exports.signUp = async function (req, res) {
    const {email, password, name, phoneNum} = req.body;
    //이메일 확인
    if(!email)
        return res.send(response(baseResponse.SIGNIN_EMAIL_EMPTY));
    if(email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));
    if(!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));
    //비밀번호 확인
    if(!password)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));
    if(password.length < 4)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));
    //이름 확인
    if(!name)
        return res.send(response(baseResponse.SIGNUP_NAME_EMPTY));
    if(name.length > 15)
        return res.send(response(baseResponse.SIGNUP_NAME_LENGTH));
    //전화번호 확인
    if(!phoneNum)
        return res.send(response(baseResponse.SIGNUP_PHONENUM_EMPTY));
    if(phoneNum.length > 15)
        return res.send(response(baseResponse.SIGNUP_PHONENUM_LENGTH));


    const signUpRes = await userService.makeUser(
        email,
        password,
        name,
        phoneNum,
    );
    return res.send(signUpRes);
}

/**
 * API No. 18
 * API Name : 로그인 API
 * [POST] /app/signIn
 * body : email, passsword
 */
exports.signIn = async function (req, res) {
    const {email, password} = req.body;
    // TODO: email, password 형식적 Validation
    if(!email) return res.response(baseResponse.SIGNIN_EMAIL_EMPTY);
    if(!regexEmail.test(email)) return res.response(baseResponse.SIGNIN_EMAIL_ERROR_TYPE);
    if(!password) return res.response(baseResponse.SIGNIN_PASSWORD_EMPTY);
    const signInRes = await userService.postUserSignIn(email, password);

    return res.send(signInRes);
};

/**
 * API No. 20
 * API Name : 검색 순위 조회 API
 * [GET] /app/searchwords/rank
 */
exports.searchRank = async function(req, res){
    const searchRanking = await userProvider.searchRankInfo();
    return res.send(response(baseResponse.SUCCESS, searchRanking));
}

/**
 * API No. 22
 * API Name : 검색 순위 조회 API
 * [GET] /app/users/{userId}/receipts
 */
exports.getReceipts = async function(req, res){
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {chargeId} = req.body;
    const result = [];
    if(!userId) return res.send(baseResponse.USER_USERID_EMPTY);
    if(userIdFromJWT!=userId){
        return response(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }
    if(!chargeId) return res.send(baseResponse.CHARGE_ID_EMPTY);
    const getReceiptsInfo = await userProvider.getReceiptsInfo(userId, chargeId);
    for(let i=0; i<getReceiptsInfo.length; i++) {
        const getReceiptsMenu = await userProvider.getReceiptsMenu(getReceiptsInfo[i].id);
        const getReceiptsPrice = await userProvider.getReceiptsPrice(getReceiptsInfo[i].id);
        result.push({receiptsInfo: getReceiptsInfo, orderMenu: getReceiptsMenu, orderPrice: getReceiptsPrice});
    }
    return res.send(response(baseResponse.SUCCESS, result));
}



/**
 * API No. 25
 * API Name : 사용자 카드 조회 API
 * [GET] /app/user/{userId}/cards
 */
exports.getCard = async function(req, res){
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    if(!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    if(userIdFromJWT!=userId){
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }
    const getCardList = await userProvider.getCardList(userId);
    return res.send(response(baseResponse.SUCCESS, getCardList));
}

/**
 * API No. 26
 * API Name : 사용자 카드 등록 API
 * [POST] /app/users/{userId}/cards
 */
exports.postCard = async function(req, res){
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {bankId, cardNum} = req.body;
    if(!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    if(userIdFromJWT!=userId){
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }
    if(!bankId) return res.send(response(baseResponse.BANK_ID_EMPTY));
    if(!cardNum) return res.send(response(baseResponse.CARD_NUM_EMPTY));
    const postCardList = await userService.postCardList(userId, bankId, cardNum);
    return res.send(response(postCardList));
}

/**
 * API No. 27
 * API Name : 사용자 카드 삭제 API
 * [PATCH] /app/users/{userId}/cards
 */
exports.patchCard = async function (req, res){
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const cardId = req.body;
    if(!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    if(userIdFromJWT!=userId){
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }
    if(!cardId) return res.send(response(baseResponse.CARD_ID_EMPTY));
    else {
        for(let i=0; i<cardId.length; i++){
            const patchCard = await userService.patchCard(cardId[i].cardId);
        }
    }
    return res.send(response(baseResponse.SUCCESS));
}

/** API No.28
 * API Name : 자동 로그인 (JWT 토큰 검증 API)
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};

/** API No.29
 * API Name : 카카오 로그인
 * [POST] /app/login/kakao
 */
exports.loginKakao = async function (req, res) {
    const { accessToken } = req.body;
    try {
        let kakao_profile;
        try {
            kakao_profile = await axios.get('https://kapi.kakao.com/v2/user/me', {
                headers: {
                    Authorization: 'Bearer ' + accessToken,
                    'Content-Type': 'application/json',
                },
            });
        } catch (err) {
            logger.error(`Can't get kakao profile\n: ${JSON.stringify(err)}`);
            return res.send(errResponse(baseResponse.USER_ACCESS_TOKEN_WRONG));
        }

        const name = kakao_profile.data.kakao_account.profile.nickname;
        const email = kakao_profile.data.kakao_account.email;
        const emailRows = await userProvider.emailCheck(email);
        // 이미 존재하는 이메일인 경우 = 회원가입 되어 있는 경우 -> 로그인 처리
        if (emailRows.length > 0) {
            const userInfoRows = await userProvider.accountCheck(email);
            const token = await jwt.sign(
                {
                    userId: userInfoRows[0].id,
                },
                secret_config.jwtsecret,
                {
                    expiresIn: '365d',
                    subject: 'userId',
                },
            );

            const result = { userId: userInfoRows[0].id, jwt: token };
            return res.send(response(baseResponse.SUCCESS, result));
            // 그렇지 않은 경우 -> 회원가입 처리
        } else {
            const result = {
                name: name,
                email: email,
                loginStatus: 'KAKAO',
            };

            const signUpResponse = await userService.createSocialUser(
                name,
                email,
                result.loginStatus,
            );
            return res.send(response(baseResponse.SUCCESS, result));
        }
    } catch (err) {
        logger.error(`App - logInKakao Query error\n: ${JSON.stringify(err)}`);
        return res.send(errResponse(baseResponse.USER_INFO_EMPTY));
    }
};

// TODO: After 로그인 인증 방법 (JWT)


/**
 * API No. 31
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 */
exports.patchUsers = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId;
    const {infoType} = req.query;
    const {editInfo} = req.body;

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if(!infoType) return res.send(errResponse(baseResponse.EDIT_INFO_TYPE_EMPTY));
        if(infoType!=='PASSWORD'&&infoType!=='PHONENUM') return res.send(errResponse(baseResponse.EDIT_INFO_TYPE_ERROR));
        if(infoType === `PASSWORD`){
            if(!editInfo) return response(baseResponse.EDIT_PASSWORD_EMPTY);
            const editUserInfo = await userService.editUserPassWord(editInfo, userId);
            return res.send(response(editUserInfo));
        }
        else if(infoType==='PHONENUM'){
            if(!editInfo) return response(baseResponse.EDIT_PHONE_NUM_EMPTY);
            const editUserInfo = await userService.editUserPhoneNum(editInfo, userId);
            return res.send(response(editUserInfo));
        }
    }
};

/**
 * API No. 32
 * API Name : 회원탈퇴 API
 * [PATCH] /app/users/{userId}/withdrawal
 */
exports.patchUserStatus = async function(req, res){
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {password} = req.body;
    if(!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    if(userIdFromJWT!=userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }
    if(!password) return res.send(response(baseResponse.SIGNIN_PASSWORD_EMPTY));
    const patchUserStatus = await userService.patchUserStatus(userId, password);
    return res.send(response(patchUserStatus));
}

/**
 * API No. 34
 * API Name : 주문 API
 * [POST] /app/users/{userId}/orders
 */
exports.makeOrders = async function (req, res){
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const ordersInfo = req.body;
    if(!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    if(userIdFromJWT!=userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }
    if(!ordersInfo) return res.send(response(baseResponse.ORDERS_INFO_EMPTY));
    for(let i=0; i<ordersInfo.length; i++) {
        const makeOrders = await userService.makeOrders(userId, ordersInfo[i].restaurantId, ordersInfo[i].menuId, ordersInfo[i].menuCount);
    }
    return res.send(response(baseResponse.SUCCESS));
}

/**
 * API No. 35
 * API Name : 푸시 알림 API
 * [GET] /app/pushAlarms
 */
// exports.pushAlarms = async function(req, res){
//     let deviceToken=`token값 입력`
//
//     let message = {
//         notification:{
//             title: 'PushAlarms Test',
//             body:'Check your CoupangEats',
//         },
//         token:deviceToken,
//     }
//
//     admin
//         .messaging()
//         .send(message)
//         .then(function(response){
//             console.log('Successfully sent message:', response)
//             return res.status(200).json({success: true})
//         })
//         .catch(function(err) {
//             console.log('Error Sending message!!! : ', err)
//             return res.status(400).json({success: false})
//         });
// }