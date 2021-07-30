const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");


const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
exports.getTest = async function (req, res) {
    return res.send(response(baseResponse.SUCCESS))
}

exports.signUp = async function (req, res) {
    const {email, password, name, phoneNum} = req.info;
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
    if(password.length < 6)
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
        phoneNum
    );
    return res.send(signUpRes);

}

/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users
 */
exports.postUsers = async function (req, res) {

    /**
     * Body: email, password, nickname
     */
    const {email, password, nickname} = req.body;

    // 빈 값 체크
    if (!email)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));

    // 길이 체크
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    // 기타 등등 - 추가하기


    const signUpResponse = await userService.createUser(
        email,
        password,
        nickname
    );

    return res.send(signUpResponse);
};

/**
 * API No. 2
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/users
 */
exports.getUsers = async function (req, res) {

    /**
     * Query String: email
     */
    const email = req.query.email;

    if (!email) {
        // 유저 전체 조회
        const userListResult = await userProvider.retrieveUserList();
        return res.send(response(baseResponse.SUCCESS, userListResult));
    } else {
        // 유저 검색 조회
        const userListByEmail = await userProvider.retrieveUserList(email);
        return res.send(response(baseResponse.SUCCESS, userListByEmail));
    }
};

/**
 * API No. 3
 * API Name : 특정 유저 조회 API
 * [GET] /app/users/{userId}
 */
exports.getUserById = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const userByUserId = await userProvider.retrieveUser(userId);
    return res.send(response(baseResponse.SUCCESS, userByUserId));
};



// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/login
 * body : email, passsword
 */
exports.login = async function (req, res) {

    const {email, password} = req.body;

    // TODO: email, password 형식적 Validation

    const signInResponse = await userService.postSignIn(email, password);

    return res.send(signInResponse);
};


/**
 * API No. 5
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
 * API No.test
 * API Name : 유저 조회 API ()
 * [GET] /app/users
 */
exports.getUsers1 = async function (req, res) {
    const userResult = await userProvider.retrieveUsers();
    return res.send(response(baseResponse.SUCCESS, userResult));
}





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
    const {userId, favoritesId} = req.body;
    if(!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    if(!favoritesId) return res.send(response(baseResponse.FAVORITES_ID_EMPTY));

    const rmFavorites = await userService.rmFavoritesList(userId, favoritesId);
    return res.send(response(rmFavorites));
}
/**
 * API No. 10
 * API Name : 즐겨찾기 항목 삭제 API
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

    const pastOrders = await userProvider.pastOrderList(userId);
    return res.send(response(baseResponse.SUCCESS, pastOrders));
}