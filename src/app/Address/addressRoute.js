module.exports = function(app) {
    const address = require('./addressController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');


    //#1 유저의 배달지 목록 조회 API (jwt 적용 완료)
    app.get('/app/users/:userId/addresses',jwtMiddleware, address.getAddress);

    //#5 배송지 삭제 API (jwt 적용 완료)
    app.patch('/app/users/:userId/addresses',jwtMiddleware, address.removeAddress);

    //#6 배송지 추가 API (jwt 적용 완료)
    app.post('/app/users/:userId/addresses', jwtMiddleware, address.addAddress);

    //#7 기본 배송지 선택 API (jwt, transaction 적용 완료)
    app.patch('/app/users/:userId/default-address', jwtMiddleware, address.defaultAddress);
}