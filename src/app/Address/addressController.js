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
 * [GET] /app/users/:userId/address
 */
exports.getAddress = async function(req, res) {
    const userId = req.params.userId;
    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const addressByUserId = await addressProvider.retrieveAddress(userId);
    return res.send(response(baseResponse.SUCCESS, addressByUserId));
}

/**
 * API No. 5
 * API Name : 유저 배달지 삭제 API
 * [PATCH] /app/users/address/edit
 */
exports.removeAddress = async function(req, res) {
    const {userId, addressId} = req.body;

    if(!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    if(!addressId) return res.send(response(baseResponse.ADDRESS_ID_EMPTY));

    const removeAddressId = await addressService.rmAddress(userId, addressId);
    return res.send(response(removeAddressId));
}

/**
 * API No. 6
 * API Name : 유저 배달지 추가 API
 * [POST] /app/users/address/add
 */
exports.addAddress = async function(req, res) {
    const {userId, roadAddress, detailAddress} = req.body;

    if(!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    if(!roadAddress) return res.send(response(baseResponse.ROAD_ADDRESS_EMPTY));
    if(!detailAddress) return res.send(response(baseResponse.DETAIL_ADDRESS_EMPTY));

    const addAddressInfo = await addressService.additAddress(userId, roadAddress, detailAddress);
    return res.send(response(addAddressInfo));
}

/**
 * API No. 7
 * API Name : 유저 배달지 설정 API
 * [POST] /app/users/address/default
 */
exports.defaultAddress = async function(req, res) {
    const {userId, addressId} = req.body;

    if(!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    if(!addressId) return res.send(response(baseResponse.ADDRESS_ID_EMPTY));

    const defaultAddressInfo = await addressService.setDefaultAddress(userId, addressId);
    return res.send(response(defaultAddressInfo));
}