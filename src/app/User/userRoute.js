module.exports = function(app) {
    const user = require('./userController');
    const passport = require('passport');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    const session = require('express-session');
    const KakaoStrategy = require('passport-kakao').Strategy;


    app.use(session({secret: 'SECRET_CODE', resave: true, saveUninitialized: false}));
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(
        'kakao-login',
        new KakaoStrategy(
            {
                clientID: 'ddbe1ff5300971f37b81413e6e4c6364',
                clientSecret: 'VmduDQJHUTBuAAxVabxEtMMlWrjx4nvS',
                callbackURL: '/auth/kakao/callback',
            },
            function (accessToken, refreshToken, profile, done) {
                result = {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    profile: profile,
                };
                console.log('KakaoStrategy', result);
                return done;
            },
        ),
    );
    passport.serializeUser((user, done) => {
        done(null, user); // user객체가 deserializeUser로 전달됨.
    });
    passport.deserializeUser((user, done) => {
        done(null, user); // 여기의 user가 req.user가 됨
    });
   

    //#2 유저가 작성한 리뷰 조회 API
    app.get('/app/users/:userId/reviews', jwtMiddleware, user.getUserReview);

    //#8 즐겨찾기 조회 API (jwt 적용 완료)
    app.get('/app/users/:userId/favorites', jwtMiddleware, user.getFavorite);

    //#9 즐겨찾기 항목 삭제 API (jwt 적용 완료)
    app.patch('/app/users/:userId/favorites', jwtMiddleware, user.removeFavorite);

    //#10 즐겨찾기 항목 추가 API (jwt 적용 완료)
    app.post('/app/users/:userId/favorites', jwtMiddleware, user.addFavorite);

    //#11 과거 주문내역 조회 API (jwt 적용 완료)
    app.get('/app/users/:userId/past-orders', jwtMiddleware, user.getPastOrders);

    //#17 회원 가입 API
    app.post('/app/signup', user.signUp);

    //#18 로그인 API
    app.post('/app/login', user.signIn); //로그인 고쳐보기

    //#20 검색 순위 조회 API
    app.get('/app/searchwords/rank', user.searchRank);

    //#22 유저 영수증 조회 API
    app.get('/app/users/:userId/receipts', jwtMiddleware, user.getReceipts);

    //#25 사용자 카드 조회 API (jwt 적용 완료)
    app.get('/app/users/:userId/cards', jwtMiddleware, user.getCard);

    //#26 사용자 카드 등록 API (jwt 적용 완료)
    app.post('/app/users/:userId/cards', jwtMiddleware, user.postCard);

    //#27 사용자 카드 삭제 API (jwt 적용 완료)
    app.patch('/app/users/:userId/cards', jwtMiddleware, user.patchCard);

    // TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
    //#28 자동 로그인 API
    app.get('/app/auto-login', jwtMiddleware, user.check);

    //#29 카카오 소셜 로그인 API
    app.post('/app/login/kakao', user.loginKakao);
    app.get('/auth/kakao/callback', passport.authenticate('kakao-login', { failureRedirect: '/auth', successRedirect: '/' }));

    // TODO: After 로그인 인증 방법 (JWT)
    //#31 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    app.patch('/app/users/:userId/info', jwtMiddleware, user.patchUsers);

    // TODO: 탈퇴하기 API
    //#32 회원 탈퇴 API
    app.patch('/app/users/:userId/withdrawal', jwtMiddleware, user.patchUserStatus);

    //#34 주문 API
    app.post('/app/users/:userId/orders', jwtMiddleware, user.makeOrders);

    //#35 푸시 알림 API
    // app.get('/app/push', user.pushAlarms);
};




