module.exports = function(app) {
    const restaurant = require('./restaurantController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    //#2 카테고리 조회 API
    app.get('/app/category', restaurant.viewCategory);

    //#3 신규 매장 순 조회 API
    app.get('/app/restaurant/sort/new', restaurant.sortNewRestaurant);

    //#4 평점 순 매장 조회 API
    app.get('/app/restaurant/sort/review', restaurant.sortReviewRestaurant);

    //#12  카테고리 검색으로 매장 조회 API
    app.get('/app/category/:categoryId/restaurant', restaurant.categorySearch);

    //#13 매장 리뷰 도움 여부 증가 API
    app.patch('/app/restaurant/review/help', restaurant.giveHelpReview);

    //#14 매장 리뷰 생성 API
    app.post('/app/restaurant/review', restaurant.addReview);
};
