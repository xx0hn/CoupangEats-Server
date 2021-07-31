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
 * API No. 8
 * API Name : 즐겨찾기 조회 API
 * [GET] /app/users/{userId}/favorites
 */
exports.getFavorite = async function(req, res){
    const userId = req.params.userId;
    if(!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    const getFavoritesByUserId = await userProvider.getFavoritesList(userId);
    return res.send(response(baseResponse.SUCCESS, getFavoritesByUserId));
}
/**
 * API No. 9
 * API Name : 즐겨찾기 항목 삭제 API
 * [PATCH] /app/users/favorites/edit
 */
exports.removeFavorite = async function(req, res) {
    const userId = req.params.userId;
    const favorites = req.body;
    if(!userId) return res.response(baseResponse.USER_USERID_EMPTY);
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
 * [POST] /app/users/favorites/edit
 */
exports.addFavorite = async function(req, res){
    const {userId, restaurantId} = req.body;
    if(!userId) return res.response(baseResponse.USER_USERID_EMPTY);
    if(!restaurantId) return res.response(baseResponse.RESTAURANT_ID_EMPTY);

    const addFavoriteRestaurant = await userService.addFavoriteList(userId, restaurantId);
    return res.send(response(addFavoriteRestaurant));
}

/**
 * API No. 11
 * API Name : 과거 주문내역 조회API
 * [GET] /app/users/{userId}/pastorder
 */
exports.getPastOrders = async function(req, res){
    const userId = req.params.userId;
    if(!userId) return res.response(baseResponse.USER_USERID_EMPTY);
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
 * [GET] /app/signUp
 */
exports.signUp = async function (req, res) {
    const {email, password, name, phoneNum, sex} = req.body;
    //이메일 확인
    if(!email)
        return res.send(response(baseResponse.SIGNIN_EMAIL_EMPTY));
    if(email.length > 45)
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