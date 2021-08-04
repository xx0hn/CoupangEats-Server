module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // TODO: After 로그인 인증 방법 (JWT)
    // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers)

    //#2 유저가 작성한 리뷰 조회 API
    app.get('/app/users/:userId/reviews', jwtMiddleware, user.getUserReview);

    //#8 즐겨찾기 조회 API (jwt 적용 완료)
    app.get('/app/users/:userId/favorites',jwtMiddleware, user.getFavorite);

    //#9 즐겨찾기 항목 삭제 API (jwt 적용 완료)
    app.patch('/app/users/:userId/favorites',jwtMiddleware, user.removeFavorite);

    //#10 즐겨찾기 항목 추가 API (jwt 적용 완료)
    app.post('/app/users/:userId/favorites',jwtMiddleware, user.addFavorite);

    //#11 과거 주문내역 조회 API (jwt 적용 완료)
    app.get('/app/users/:userId/past-orders', jwtMiddleware, user.getPastOrders);

    //#17 회원 가입 API
    app.post('/app/signUp', user.signUp);

    //#18 로그인 API
    app.post('/app/signIn', user.signIn); //로그인 고쳐보기

    //#20 검색 순위 조회 API
    app.get('/app/searchwords/rank', user.searchRank);

    //#23 메뉴 담기 API
    app.post('/app/users/add/orders', user.addOrders); //삭제

    //#24 결제 API
    app.post('/app/payment', user.payment); //어려우니까 마지막에

    //#25 사용자 카드 조회 API (jwt 적용 완료)
    app.get('/app/users/:userId/cards',jwtMiddleware, user.getCard);

    //#26 사용자 카드 등록 API (jwt 적용 완료)
    app.post('/app/users/:userId/cards',jwtMiddleware, user.postCard);

    //#27 사용자 카드 삭제 API
    app.patch('/app/users/:userId/cards',jwtMiddleware, user.patchCard); //jwt 적용해야됨

    //#28 탈퇴하기 API
    // app.patch('/app/signOut', user.signOut)
};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API

