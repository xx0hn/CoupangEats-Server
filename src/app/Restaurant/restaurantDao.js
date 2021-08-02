//카테고리 목록 조회
async function selectCategory(connection){
    const selectCategoryResultQuery =`
    select id as CategoryId
            , name as CategoryName
            , imageUrl as CategoryImageUrl
from Category`;
    const [categoryRows] = await connection.query(selectCategoryResultQuery);
    return categoryRows;
}

//신규 매장 순 조회
async function selectNewRestaurant(connection){
    const selectNewRestaurantResultQuery = `
    select a.id as RestaurnatId
            , a.name as RestaurantName
            , concat(b.imageUrl) as RestaurantImage
            , case when a.delCost = 0 then '무료배달' else a.delCost end as DeliveryCost
            , case when a.cheetaDel = 1 then '치타배달' else '일반배달' end as DeliveryType
            , a.delTIme as DeliveryTime
            , a.maxDelTIme as MaxDeliveryTime
            , a.createdAt as CreatedDate
from Restaurant a
left join ( select id
                , restaurantId
                , imageUrl
                from RestaurantImageUrl
                group by restaurantId ) as b
                on a.id = b.restaurantId
left join ( select id
                    , restaurantId
                    , latitude
                    , longtitude
                from RestaurantAddress ) as c
                on a.id = c.restaurantId
order by a.createdAt desc;`
    const [newRestaurantRows] = await connection.query(selectNewRestaurantResultQuery);
    return newRestaurantRows;
}

//평점 순 매장 조회
async function selectReviewRestaurant(connection){
    const selectReviewRestaurantResultQuery=`
    select a.id as RestaurantId
            , a.name as RestaurantName
            , concat(b.imageUrl) as RestaurantImage
            , case when starGrade is null then 0 else starGrade end as StarGrade
            , case when reviewCount is null then 0 else reviewCount end as ReviewCount
            , case when a.delCost = 0 then '무료배달' else a.delCost end as DeliveryCost
            , case when a.cheetaDel = 1 then '치타배달' else '일반배달' end as DeliveryType
            , a.delTIme as DeliveryTime
            , a.maxDelTIme as MaxDeliveryTime
from Restaurant a 
left join ( select id
                    , restaurantId
                    , imageUrl
                from RestaurantImageUrl
                group by restaurantId ) as b
                on a.id = b.restaurantId
left join ( select id
                    , restaurantId
                    , latitude
                    , longtitude
                from RestaurantAddress ) as c
                on a.id = c.restaurantId
left join ( select id
                    , restaurantId
                    , round(sum(score)/count(restaurantId), 1) as 'starGrade'
                    , count(restaurantId) as 'reviewCount'
                from Review 
                group by restaurantId ) as d
                on a.id = d.restaurantId
order by starGrade desc`;
    const [reviewRestaurantRows] = await connection.query(selectReviewRestaurantResultQuery);
    return reviewRestaurantRows;
}

//카테고리로 매장 조회
async function selectRestaurantByCategoryId(connection, categoryId){
    const selectRestaurantByCategoryIdQuery =`
    select c.id as CategoryId
        , c.name as CategoryName
        , b.id as RestaurantId
        , b.name as RestaurantName
        , case when b.cheetaDel = 1 then '치타배달' else '일반배달' end as DeliveryType
        , e.imageUrl as RestaurantImage 
        , case when starGrade is null then 0 else starGrade end as StarGrade
        , case when reviewCount is null then 0 else reviewCount end as ReviewCount
        , case when b.delCost = 0 then '무료배달' else b.delCost end as DeliveryCost
        , b.delTIme as DeliveryTime
        , b.maxDelTIme as MaxDeliveryTIme
from RestaurantCategory a
left join ( select id
                    , name
                    , delCost
                    , delTIme
                    , maxDelTIme
                    , openTime
                    , cheetaDel
                    , status
                from Restaurant ) as b
                on a.restaurantId = b.id
left join ( select id
                    , name
                from Category ) as c
                on a.categoryId = c.id
left join ( select id
                    , score
                    , restaurantId
                    , round(sum(score)/count(restaurantId), 1) as 'starGrade'
                    , count(restaurantId) as 'reviewCount'
                from Review 
                group by restaurantId ) as d
                on b.id = d.restaurantId
left join ( select id
                    , restaurantId
                    , imageUrl
                from RestaurantImageUrl ) as e
                on b.id = e.restaurantId
where c.id = ?
group by b.id;
`;
    const [restaurantByCategoryIdRows] = await connection.query(selectRestaurantByCategoryIdQuery, categoryId);
    return restaurantByCategoryIdRows;
}

//리뷰 도움 횟수 증가
async function updateReviewHelpNum(connection, reviewId) {
    const updateReviewHelpNumQuery=`
    update Review
set helped = helped+1
where id = ?;`;
    const [reviewHelpRows] = await connection.query(updateReviewHelpNumQuery, [reviewId]);
    return reviewHelpRows;
}

//리뷰 등록
async function addReview(connection, userId, chargeId, restaurantId, reviewScore, contents, imageUrl) {
    const addReviewQuery=`
    insert into Review(userId, chargeId, restaurantId, score, contents, imageUrl)
values (?, ?, ?, ?, ?, ?);`;
    const [addedReviewRows] = await connection.query(addReviewQuery, [userId, chargeId, restaurantId, reviewScore, contents, imageUrl]);
    return addedReviewRows;
}

//리뷰 수정
async function updateRestaurantReview(connection, reviewScore, contents, imageUrl, reviewId) {
    const updateRestaurantReviewQuery=`
    update Review
    set score = ?, contents = ?, imageUrl =?
    where id = ?;`;
    const [updatedReviewRows] = await connection.query(updateRestaurantReviewQuery, [reviewScore, contents, imageUrl, reviewId]);
    return updatedReviewRows;
}
//매장 리뷰 전체 조회
async function getReviews(connection, restaurantId){
    const getReviewsQuery=`
    select  a.chargeId as id
           , d.id as UserId
            , concat(left(d.name, 1), '**') as UserName
            , a.score as StarGrade
            , concat(timestampdiff(day, a.createdAt, current_timestamp), '일전') as DaysAgo
            , a.imageUrl as ReviewImage
            , a.contents as ReviewContents
from Review a
left join ( select id
                from Restaurant ) as b
                on a.restaurantId = b.id
left join ( select id
                    , userId
                    , restaurantId
                    , chargeId
                    , menuId
                from Orders 
                group by restaurantId) as c
                on a.restaurantId = c.restaurantId
left join ( select id
                    , name
                from User ) as d
                on a.userId = d.id
where b.id = ? and a.imageUrl is not null
order by a.createdAt desc;`;
    const [reviewsRows] = await connection.query(getReviewsQuery, restaurantId);
    return reviewsRows;
}

//주문 음식 조회
async function getOrdersFood(connection, restaurantId, chargeId) {
    const getOrdersFoodQuery =`
        select c.name      as MenuName
             , b.menuCount as MenuCount
        from Charge a
                 left join (select id
                                 , chargeId
                                 , menuId
                                 , menuCount
                                 , restaurantId
                            from Orders) as b
                           on a.id = b.chargeId
                 left join (select id
                                 , name
                                 , restaurantId
                            from Menu) as c
                           on b.menuId = c.id
        where a.restaurantId = ?
          and a.id = ?;`;
    const [foodRows] = await connection.query(getOrdersFoodQuery,[restaurantId, chargeId]);
    return foodRows;
}

//매장 메인화면 조회 (카테고리만)
async function getRestaurantMainInfo(connection, restaurantId) {
    const getRestaurantMainInfoQuery=`
    select b.id as RestaurantId
            , b.name as RestarantName
            , starGrade as StarGrade
            , reviewCount as ReviewCount
            , concat(b.delTIme,'-',b.maxDelTIme,'분') as DeliveryTime
            , concat(format(b.delCost,0), '원') as DeliveryCost
            , concat(format(b.minCost,0),'원') as MinimumCost
from MenuCategory a
left join ( select id
                    , name
                    , delTIme
                    , maxDelTIme
                    , minCost
                    , delCost
                    , cheetaDel
                    , serviceType
                from Restaurant ) as b
                on a.restaurantId = b.id
left join ( select score
                    , restaurantId
                    , round(sum(score)/count(restaurantId),1) as 'starGrade'
                    , count(restaurantId) as 'reviewCount'
                from Review
                group by restaurantId) as c
                on a.restaurantId = c.restaurantId
where a.restaurantId = ?
group by a.restaurantId;`;
    const [restaurantInfoRows] = await connection.query(getRestaurantMainInfoQuery, restaurantId);
    return restaurantInfoRows;
}

//매장 내의 카테고리만 조회
async function getSmallCategory(connection, restaurantId){
    const getSmallCategoryQuery=`
    select id as id
    , name as Name
    from MenuCategory
    where restaurantId = ?;`;
    const [smallCategoryRows] = await connection.query(getSmallCategoryQuery, restaurantId);
    return smallCategoryRows;
}

//카테고리 내의 메뉴 조회
async function getMenuInCategory(connection, categoryId){
    const getMenuInCategoryQuery=`
    select categoryId as id
            , name as Name
            , concat(format(cost,0),'원') as Cost
            , contents as Info
from Menu
where  categoryId = ?;`;
    const [menuInCategoryRows] = await connection.query(getMenuInCategoryQuery,  categoryId);
    return menuInCategoryRows;
}

//매장 리뷰 조회
async function getSomeReview(connection, restaurantId){
    const getSomeReviewQuery=`
    select b.imageUrl as ReviewImage
            , b.contents as ReviewContents
            , b.score as ReviewScore
from Restaurant a
left join ( select id
                    , imageUrl
                    , contents
                    , score
                    , restaurantId
                from Review ) as b
                on a.id = b.restaurantId
where a.id = ?;`;
    const [someReviewRows] = await connection.query(getSomeReviewQuery, restaurantId);
    return someReviewRows;
}

//매장 이미지 조회
async function getRestaurantImageUrl (connection, restaurantId){
    const getRestaurantImageUrlQuery =`
    select imageUrl as ImageUrl
    from RestaurantImageUrl
    where restaurantId = ?;`;
    const [imageUrlRows] = await connection.query(getRestaurantImageUrlQuery, restaurantId);
    return imageUrlRows;
}

//치타배달 매장 조회
async function selectCheetahDeliveryRestaurant(connection){
    const selectCheetahDeliveryRestaurantQuery=`
    select a.id as id
        , a.name as RestaurantName
        , case when a.cheetaDel = 1 then '치타배달' end as CheetahDelivery
        , case when starGrade is null then 0 else starGrade end as StarGrade
        , case when reviewCount is null then 0 else reviewCount end as ReviewCount
        , case when a.delCost = 0 then '무료배달' else concat(format(a.delCost,0),'원') end as DeliveryCost
        , concat(a.delTIme,'-',a.maxDelTIme,'분') as DeliveryTime
from Restaurant a
left join ( select restaurantId
                    , latitude
                    , longtitude
                from RestaurantAddress ) as b
                on a.id = b.restaurantId
left join ( select restaurantId
                    , round(sum(score)/count(restaurantId), 1) as 'starGrade'
                    , count(restaurantId) as 'reviewCount'
                from Review
                group by restaurantId) as c
                on a.id = c.restaurantId
where a.cheetaDel = 1;`;
    const [cheetahRestaurantRows] = await connection.query(selectCheetahDeliveryRestaurantQuery);
    return cheetahRestaurantRows;
}

//매장 이미지 조회
async function selectResImage(connection, restaurantId){
    const selectResImageQuery=`
    select a.id as restaurantId
            , b.imageUrl
from Restaurant a
left join ( select restaurantId
                , imageUrl
                from RestaurantImageUrl ) as b
                on a.id = b.restaurantId
where a.id = ?;`;
    const [resImageRows] = await connection.query(selectResImageQuery, restaurantId);
    return resImageRows;
}

//매장 리뷰 전체 정보 조회 (사진 없는)
async function selectNonPhotoReview(connection, restaurantId){
    const selectNonPhotoReviewQuery=`
    select a.id as id
        , concat(a.name, '리뷰') as RestaurantNameReview
        , starGrade as StarGrade
        , reviewCount as ReviewCount
from Restaurant a
left join ( select round(sum(score)/count(restaurantId), 1) as 'starGrade'
                        , count(restaurantId) as 'reviewCount'
                        , createdAt
                        , restaurantId
                from Review 
                group by restaurantId) as b
                on a.id = b.restaurantId
where a.id = ?;`;
    const [nonPhotoRestaurantInfoRows] = await connection.query(selectNonPhotoReviewQuery, restaurantId);
    return nonPhotoRestaurantInfoRows;
}

//사진 없는 리뷰 조회
async function selectNonReviews(connection, restaurantId){
    const selectNonReviewsQuery=`
    select  a.chargeId as id
           , d.id as UserId
            , concat(left(d.name, 1), '**') as UserName
            , a.score as StarGrade
            , concat(timestampdiff(day, a.createdAt, current_timestamp), '일전') as DaysAgo
            , a.contents as ReviewContents
from Review a
left join ( select id
                from Restaurant ) as b
                on a.restaurantId = b.id
left join ( select id
                    , userId
                    , restaurantId
                    , chargeId
                    , menuId
                from Orders 
                group by restaurantId) as c
                on a.restaurantId = c.restaurantId
left join ( select id
                    , name
                from User ) as d
                on a.userId = d.id
where b.id = ? and a.imageUrl is null
order by a.createdAt desc;`;
    const [nonReviewsRows] = await connection.query(selectNonReviewsQuery, restaurantId);
    return nonReviewsRows;
}

//사진 없는 리뷰 음식 조회
async function selectNonPhotoReviewMenu(connection, chargeId){
    const selectNonPhotoReviewMenuQuery=`
    select c.name      as MenuName
             , b.menuCount as MenuCount
        from Charge a
                 left join (select id
                                 , chargeId
                                 , menuId
                                 , menuCount
                                 , restaurantId
                            from Orders) as b
                           on a.id = b.chargeId
                 left join (select id
                                 , name
                                 , restaurantId
                            from Menu) as c
                           on b.menuId = c.id
        where a.id = ?;`;
    const [nonPhotoReviewMenuRows] = await connection.query(selectNonPhotoReviewMenuQuery, chargeId);
    return nonPhotoReviewMenuRows;
}
module.exports = {
    selectCategory,
    selectNewRestaurant,
    selectReviewRestaurant,
    selectRestaurantByCategoryId,
    updateReviewHelpNum,
    addReview,
    updateRestaurantReview,
    getReviews,
    getOrdersFood,
    getRestaurantMainInfo,
    getSmallCategory,
    getMenuInCategory,
    getSomeReview,
    getRestaurantImageUrl,
    selectCheetahDeliveryRestaurant,
    selectResImage,
    selectNonPhotoReview,
    selectNonReviews,
    selectNonPhotoReviewMenu,
};