const jwtMiddleware = require("../../../config/jwtMiddleware");
const addressProvider = require("../../app/Address/addressProvider");
const addressService = require("../../app/Address/addressService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");


const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 1
 * API Name : 유저 배달지 조회 API
 * [GET] /app/users/:userId/addresses
 */
exports.getAddress = async function(req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(userIdFromJWT!=userId){
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }

    const addressByUserId = await addressProvider.retrieveAddress(userId);
    return res.send(response(baseResponse.SUCCESS, addressByUserId));
}

/**
 * API No. 5
 * API Name : 유저 배달지 삭제 API
 * [PATCH] /app/users/{userId}/addresses
 */
exports.removeAddress = async function(req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {addressId} = req.body;

    if(!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    if(userIdFromJWT!=userId){
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }
    if(!addressId) return res.send(response(baseResponse.ADDRESS_ID_EMPTY));

    const removeAddressId = await addressService.rmAddress(userId, addressId);
    return res.send(response(removeAddressId));
}

/**
 * API No. 6
 * API Name : 유저 배달지 추가 API
 * [POST] /app/users/{userId}/addresses
 */
exports.addAddress = async function(req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {setStatus} = req.query;
    const {roadAddress, detailAddress, roadNavigate, latitude, longtitude} = req.body;

    if(!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    if(userIdFromJWT!=userId){
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }
    if(!roadAddress) return res.send(response(baseResponse.ROAD_ADDRESS_EMPTY));
    if(!detailAddress) return res.send(response(baseResponse.DETAIL_ADDRESS_EMPTY));
    if(!latitude) return res.send(response(baseResponse.LATITUDE_EMPTY));
    if(!longtitude) return res.send(response(baseResponse.LONGTITUDE_EMPTY));
    if(!setStatus) return res.send(response(baseResponse.SET_STATUS_EMPTY));
    if(setStatus!=='HOME'&&setStatus!=='COMPANY'&&setStatus!=='NOT')
        return res.send(response(baseResponse.SET_STATUS_TYPE_ERROR));

    const addAddressInfo = await addressService.additAddress(userId, roadAddress, detailAddress, roadNavigate, latitude, longtitude, setStatus);
    return res.send(response(addAddressInfo));
}

/**
 * API No. 7
 * API Name : 유저 기본 배달지 설정 API
 * [PATCH] /app/users/{userId}/default-address
 */
exports.defaultAddress = async function(req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {addressId} = req.body;

    if(!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    if(userIdFromJWT!=userId){
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }
    if(!addressId) return res.send(response(baseResponse.ADDRESS_ID_EMPTY));

    const defaultAddressInfo = await addressService.setDefaultAddress(userId, addressId);
    return res.send(response(defaultAddressInfo));
}