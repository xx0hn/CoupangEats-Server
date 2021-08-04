const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");


const regexEmail = require("regex-email");
const {emit} = require("nodemon");




// TODO: After 로그인 인증 방법 (JWT)


/**
 * API No.
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname
 */
exports.patchUsers = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId

    const userId = req.params.userId;
    const nickname = req.body.nickname;

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

        const editUserInfo = await userService.editUser(userId, nickname)
        return res.send(editUserInfo);
    }
};

/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};

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
    const {email, password, name, phoneNum, sex} = req.body;
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
    //성별 확인
    if(!sex)
        return res.send(response(baseResponse.SIGNUP_SEX_EMPTY));
    if(sex!='male'&&sex!='female')
        return res.send(response(baseResponse.SIGNUP_SEX_ERROR_TYPE));

    const signUpRes = await userService.makeUser(
        email,
        password,
        name,
        phoneNum,
        sex
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
 * API No. 23
 * API Name : 메뉴 담기 API
 * [POST] /app/users/{userId}/addOrders
 */
exports.addOrders = async function(req, res){
    const {userId, restaurantId, menuId, menuCount} = req.body;
    if(!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    if(!restaurantId) return res.send(response(baseResponse.RESTAURANT_ID_EMPTY));
    if(!menuId) return res.send(response(baseResponse.MENU_ID_EMPTY));
    if(!menuCount) return res.send(response(baseResponse.MENU_COUNT_EMPTY));
    const addOrders = await userService.addOrders(userId, restaurantId, menuId, menuCount);
    return res.send(response(addOrders));
}

/**
 * API No. 24
 * API Name : 결제 API
 * [POST] /app/payment
 */
exports.payment = async function(req, res){
    const {cardId, couponId, restaurantId, request} = req.body;
    if(!cardId) return res.send(response(baseResponse.CARD_ID_EMPTY));
    if(!restaurantId) return res.send(response(baseResponse.RESTAURANT_ID_EMPTY));
    const addPayment = await userService.addPayment(cardId, couponId, restaurantId, request);
    return res.send(response(addPayment));
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

// /**
//  * API No. 28
//  * API Name : 탈퇴하기 API
//  * [PATCH] /app/signOut
//  */
// exports.signOut = async function (req, res){
//     const {userId, email, password} = req.body;
//     if(!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
//     if(!email) return res.send(response(baseResponse.USER_USEREMAIL_EMPTY));
//     if(!password) return res.send(response(baseResponse.SIGNIN_PASSWORD_EMPTY));
//     const signOut = await userService.signOutUser(userId, email, password);
//     return res.send(response(baseResponse.SUCCESS));
//
// }