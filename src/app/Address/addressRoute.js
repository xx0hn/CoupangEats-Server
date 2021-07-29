module.exports = function(app) {
    const address = require('./addressController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');


    //#1 유저의 배달지 목록 조회 API
    app.get('/app/users/:userId/address', address.getAddress);

    //#5 배송지 삭제 API
    app.patch('/app/users/address/edit', address.removeAddress);
}