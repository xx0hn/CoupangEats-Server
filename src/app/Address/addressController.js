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
 * [PATCH] /app/users/address
 */
exports.removeAddress = async function(req, res) {
    const {userId, addressId} = req.body;

    if(!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    if(!addressId) return res.send(response(baseResponse.ADDRESS_ID_EMPTY));

    const removeAddressId = await addressService.rmAddress(userId, addressId);
    return res.send(response(baseResponse.SUCCESS, removeAddressId));
}