module.exports = function(app) {
    const restaurant = require('./restaurantController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    //#3 매장 우선순위 정렬 조회 API
    app.get('/app/restaurants', restaurant.sortRestaurant);

    //#4 리뷰 도움 여부 취소 API (jwt 적용 완료)
    app.patch('/app/users/:userId/helped-review', jwtMiddleware, restaurant.cancelHelped);

    //#12  검색으로 매장 조회 API
    app.get('/app/searchwords', restaurant.categorySearch);

    //#13 매장 리뷰 도움 여부 증가 API (jwt, transaction 적용 완료)
    app.post('/app/users/:userId/helped-review',jwtMiddleware, restaurant.giveHelpReview);

    //#14 매장 리뷰 생성 API (jwt 적용 완료)
    app.post('/app/users/:userId/reviews',jwtMiddleware, restaurant.addReview);

    //#15 매장 리뷰 수정 API
    app.patch('/app/users/:userId/reviews',jwtMiddleware, restaurant.editReview); //jwt 적용해야됨

    //#16 사진 있는 매장 리뷰 상세 조회 API
    app.get('/app/restaurants/:restaurantId/photoReview', restaurant.getReview); //쿼리 스트링

    //#19 매장 메인 화면 조회 API
    app.get('/app/restaurants/:restaurantId/main', restaurant.restaurantMain);

    //#21 치타배달 매장 조회 API
    app.get('/app/restaurants/cheetah', restaurant.cheetahRestaurant);

    //#22 사진 없는 매장 리뷰 조회 API
    app.get('/app/restaurants/:restaurantId/review', restaurant.reviewGet); //쿼리 스트링
};
