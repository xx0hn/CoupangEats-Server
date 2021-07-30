module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 테스트 API
    app.get('/app/test', user.getTest)

    // 1. 유저 생성 (회원가입) API
    app.post('/app/users', user.postUsers);

    // 2. 유저 조회 API (+ 검색)
    app.get('/app/users',user.getUsers); 

    // 3. 특정 유저 조회 API
    app.get('/app/users/:userId', user.getUserById);



    // TODO: After 로그인 인증 방법 (JWT)
    // 로그인 하기 API (JWT 생성)
    app.post('/app/login', user.login);

    // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers)


    //#test 유저 목록 조회 API
    app.get('/app/users1', user.getUsers1);






    //#8 즐겨찾기 조회 API
    app.get('/app/users/:userId/favorites', user.getFavorite);

    //#9 즐겨찾기 항목 삭제 API
    app.patch('/app/users/favorites/edit', user.removeFavorite);

    //#10 즐겨찾기 항목 추가 API
    app.post('/app/users/favorites/add', user.addFavorite);

    //#11 과거 주문내역 조회 API
    app.get('/app/users/:userId/pastorder', user.getPastOrders);

};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API

