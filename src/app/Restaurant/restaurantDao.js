//신규 순 매장 조회
async function sortNewRestaurant(connection){
    const sortNewRestaurantQuery=`
        select a.id as id
            , a.name as RestaurantName
            , case when a.delCost = 0 then '무료배달' else concat(format(a.delCost,0), '원') end as DeliveryCost
            , a.cheetaDel as DeliveryType
            , concat(a.delTIme,'-',a.maxDelTIme,'분') as DeliveryTime
            , a.createdAt as CreatedDate
            , case when a.status = 'ACTIVE' then '주문가능' else '주문불가' end as Status
from Restaurant a
left join ( select id
                    , restaurantId
                    , latitude
                    , longtitude
                from RestaurantAddress ) as b
                on a.id = b.restaurantId
order by a.createdAt desc;`;
    const [newRestaurantRows] = await connection.query(sortNewRestaurantQuery);
    return newRestaurantRows;
}

//별점 순 매장 조회
async function sortStarGradeRestaurant(connection){
    const sortStarGradeRestaurantQuery=`
    select a.id as id
            , a.name as RestaurantName
            , case when starGrade is null then 0 else starGrade end as StarGrade
            , case when reviewCount is null then 0 else reviewCount end as ReviewCount
            , case when a.delCost = 0 then '무료배달' else concat(format(a.delCost,0), '원') end as DeliveryCost
            , a.cheetaDel as DeliveryType
            , concat(a.delTIme,'-',a.maxDelTIme,'분') as DeliveryTime
            , case when a.status = 'ACTIVE' then '주문가능' else '주문불가' end as Status
from Restaurant a
left join ( select id
                    , restaurantId
                    , latitude
                    , longtitude
                from RestaurantAddress ) as b
                on a.id = b.restaurantId
left join ( select restaurantId
                    , round(sum(score)/count(restaurantId),1) as 'starGrade'
                    , count(restaurantId) as 'reviewCount'
                from Review
                group by restaurantId ) as c 
                on a.id = c.restaurantId
order by starGrade desc;`;
    const [starGradeRestaurantRows] = await connection.query(sortStarGradeRestaurantQuery);
    return starGradeRestaurantRows;
}

//주문 많은 순 매장 조회
async function sortOrderCountRestaurant(connection){
    const sortOrderCountRestaurantQuery =`
    select a.id as id
            , a.name as RestaurantName
            , case when starGrade is null then 0 else starGrade end as StarGrade
            , case when reviewCount is null then 0 else reviewCount end as ReviewCount
            , case when orderCount is null then 0 else orderCount end as OrderCount
            , case when a.delCost = 0 then '무료배달' else concat(format(a.delCost,0), '원') end as DeliveryCost
            , a.cheetaDel as DeliveryType
            , concat(a.delTIme,'-',a.maxDelTIme,'분') as DeliveryTime
            , case when a.status = 'ACTIVE' then '주문가능' else '주문불가' end as Status
from Restaurant a
left join ( select id
                    , restaurantId
                    , latitude
                    , longtitude
                from RestaurantAddress ) as b
                on a.id = b.restaurantId
left join ( select restaurantId
                    , round(sum(score)/count(restaurantId),1) as 'starGrade'
                    , count(restaurantId) as 'reviewCount'
                from Review
                group by restaurantId ) as c 
                on a.id = c.restaurantId
left join ( select id
                    , restaurantId
                    , count(restaurantId) as 'orderCount'
                from Charge
                group by restaurantId ) as d
                on a.id = d.restaurantId
order by orderCount desc;`;
    const [orderCountRestaurantRows] = await connection.query(sortOrderCountRestaurantQuery);
    return orderCountRestaurantRows;
}

//도움 취소
async function cancelHelped(connection, userId, reviewId){
    const cancelHelpedQuery=`
    update Helped
    set status = 'DELETED'
    where userId = ? and reviewId = ?;`;
    const [cancelHelpedRows] = await connection.query(cancelHelpedQuery, [userId, reviewId]);
    return cancelHelpedRows;
}

//검색어로 매장 조회
async function selectRestaurantByCategoryId(connection, word, words){
    const selectRestaurantByCategoryIdQuery =`
    select c.id as CategoryId
        , c.name as CategoryName
        , b.id as RestaurantId
        , b.name as RestaurantName
        , b.cheetaDel as DeliveryType
        , case when starGrade is null then 0 else starGrade end as StarGrade
        , case when reviewCount is null then 0 else reviewCount end as ReviewCount
        , case when b.delCost = 0 then '무료배달' else concat(format(b.delCost, 0),'원') end as DeliveryCost
        , concat(b.delTIme,'-',b.maxDelTIme,'분') as DeliveryTime
        , case when a.status = 'ACTIVE' then '주문가능' else '주문불가' end as Status
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
where b.name = ? or c.name = ?
group by b.id;
`;
    const [restaurantByCategoryIdRows] = await connection.query(selectRestaurantByCategoryIdQuery, [word, words]);
    return restaurantByCategoryIdRows;
}

//reviewId로 유저 조회
async function selectUserByReviewId(connection, userId, reviewId){
    const selectUserByReviewIdQuery =`
    select userId
    from Helped
    where userId = ? and reviewId = ?;`;
    const [userByReviewIdRows] = await connection.query(selectUserByReviewIdQuery, [userId, reviewId]);
    return userByReviewIdRows;
}

//도움됐어요 INACTIVE or DELETED의 갯수
async function selectHelpedStatus(connection, userId, reviewId){
    const selectHelpedStatusQuery=`
    select id
    from Helped
    where userId = ? and reviewId = ? and (status = 'INACTIVE' or status ='DELETED');`;
    const [statusRows] = await connection.query(selectHelpedStatusQuery, [userId, reviewId]);
    return statusRows;
}

//도움됐어요의 status가 ACTIVE가 아닌 경우의 도움 횟수 증가
async function changeHelpedStatus(connection, userId, reviewId){
    const changeHelpedStatusQuery=`
    update Helped
    set status = 'ACTIVE'
    where userId =? and reviewId = ?;`;
    const [changeStatusRows] = await connection.query(changeHelpedStatusQuery, [userId, reviewId]);
    return changeStatusRows;
}

//리뷰 도움 횟수 증가
async function updateReviewHelpNum(connection,userId, reviewId) {
    const updateReviewHelpNumQuery=`
    insert into Helped(userId, reviewId)
    values (?, ?);`;
    const [reviewHelpRows] = await connection.query(updateReviewHelpNumQuery, [userId, reviewId]);
    return reviewHelpRows;
}

//chargeId를 통한 리뷰 조회
async function selectReviewByChargeId(connection, chargeId){
    const selectReviewByChargeIdQuery=`
    select id
    from Review
    where chargeId = ? ;`;
    const [reviewByChargeIdRows] = await connection.query(selectReviewByChargeIdQuery, chargeId);
    return reviewByChargeIdRows;
}

//리뷰 등록
async function addReview(connection, userId, chargeId, restaurantId, reviewScore, contents, imageUrl) {
    const addReviewQuery=`
    insert into Review(userId, chargeId, restaurantId, score, contents, imageUrl)
values (?, ?, ?, ?, ?, ?);`;
    const [addedReviewRows] = await connection.query(addReviewQuery, [userId, chargeId, restaurantId, reviewScore, contents, imageUrl]);
    return addedReviewRows;
}

//기간으로 리뷰 조회
async function selectReviewByPeriod(connection, userId, reviewId){
    const selectReviewByPeriodQuery =`
    select id
    from Review
    where userId = ? and id = ? and timestampdiff(day, createdAt, current_timestamp) > 30;`;
    const [periodReviewRows] = await connection.query(selectReviewByPeriodQuery, [userId, reviewId]);
    return periodReviewRows;
}

//리뷰 수정
async function updateRestaurantReview(connection, reviewScore, contents, imageUrl, reviewId) {
    const updateRestaurantReviewQuery=`
    update Review
    set score = ?, contents = ?, imageUrl =?, updatedAt = current_timestamp
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
            , case when helpedCount is null then 0 else helpedCount end as ReviewHelpedCount
            , case when notHelpedCount is null then 0 else notHelpedCount end as ReviewNotHelpedCount
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
left join ( select id
                    , userId
                    , reviewId
                    , count(case when status ='ACTIVE' and reviewId is not null then 1 end ) as 'helpedCount'
            from Helped
            group by reviewId ) as e
            on a.id = e.reviewId
left join ( select id
                    , userId
                    , reviewId
                    , count(case when status = 'ACTIVE' and reviewId is not null then 1 end ) as 'notHelpedCount'
                from NotHelped
                group by reviewId ) as f
                on a.id = f.reviewId
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
            , case when b.status = 'ACTIVE' then '주문가능' else '주문불가' end as Status
from MenuCategory a
left join ( select id
                    , name
                    , delTIme
                    , maxDelTIme
                    , minCost
                    , delCost
                    , cheetaDel
                    , serviceType
                    , status
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
                    , status
                from Review ) as b
                on a.id = b.restaurantId
where a.id = ? and b.status = 'ACTIVE';`;
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
        , a.cheetaDel as DeliveryType
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
where a.cheetaDel = 'CHEETAH';`;
    const [cheetahRestaurantRows] = await connection.query(selectCheetahDeliveryRestaurantQuery);
    return cheetahRestaurantRows;
}

//모든 배달 유형 매장 조회
async function selectDeliveryRestaurant(connection){
    const selectDeliveryRestaurantQuery=`
    select a.id as id
        , a.name as RestaurantName
        , a.cheetaDel as DeliveryType
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
                on a.id = c.restaurantId;`;
    const [allDeliveryRestaurantRows] = await connection.query(selectDeliveryRestaurantQuery);
    return allDeliveryRestaurantRows;
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
            , case when helpedCount is null then 0 else helpedCount end as ReviewHelpedCount
            , case when notHelpedCount is null then 0 else notHelpedCount end as ReviewNotHelpedCount
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
left join ( select id
                 , userId
                 , reviewId
                 , count(case when status ='ACTIVE' and reviewId is not null then 1 end ) as 'helpedCount'
            from Helped
            group by reviewId ) as e
          on a.id = e.reviewId
left join ( select id
                 , userId
                 , reviewId
                 , count(case when status = 'ACTIVE' and reviewId is not null then 1 end ) as 'notHelpedCount'
            from NotHelped
            group by reviewId ) as f
          on a.id = f.reviewId
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

//도움 안됨을 이미 추가했는지 확인
async function selectNotHelpedByUser(connection, userId, reviewId){
    const selectNotHelpedByUserQuery=`
    select id
    from NotHelped
    where userId = ? and reviewId = ?;`;
    const [notHelpedRows] = await connection.query(selectNotHelpedByUserQuery, [userId, reviewId]);
    return notHelpedRows;
}

//도움 안됨의 상태 확인
async function selectNotHelpedStatus(connection, userId, reviewId){
    const notHelpedCheckQuery=`
    select id
    from NotHelped
    where userId = ? and reviewId = ? and (status = 'INACTIVE' or status = 'DELETED');`;
    const [notHelpedStatusRows] = await connection.query(notHelpedCheckQuery, [userId, reviewId]);
    return notHelpedStatusRows;
}

//도움 안됨의 상태 변경
async function changeNotHelpedStatus(connection, userId, reviewId){
    const changeNotHelpedStatusQuery=`
    update NotHelped
    set status = 'ACTIVE'
    where userId = ? and reviewId = ?;`;
    const [changeNotHelpedStatusRows] = await connection.query(changeNotHelpedStatusQuery, [userId, reviewId]);
    return changeNotHelpedStatusRows;
}

//도움 안됨 추가
async function addNotHelped(connection, userId, reviewId){
    const addNotHelpedQuery=`
    insert into NotHelped(userId, reviewId)
    values (?, ?);`;
    const [notHelpedRows] = await connection.query(addNotHelpedQuery, [userId, reviewId]);
    return notHelpedRows;
}

//도움 안됨 취소
async function cancelNotHelped(connection, userId, reviewId){
    const cancelNotHelpedQuery=`
    update NotHelped
    set status = 'DELETED';`;
    const [cancelNotHelpedRows] = await connection.query(cancelNotHelpedQuery, [userId, reviewId]);
    return cancelNotHelpedRows;
}

//매장 정보 조회
async function selectRestaurantInfo(connection, restaurantId){
    const selectRestaurantInfoQuery=`
    select a.id as RestaurantId
        , a.name as RestaurantName
        , concat(substring(a.phoneNum,1,2),'-',substring(a.phoneNum, 3,3),'-',substring(a.phoneNum,5,4)) as PhoneNumber
        , concat(b.roadAddress,' ', b.detailAddress) as Address
        , a.owner as OwnerName
        , concat(substring(a.businessNum,1,2),'-',substring(a.businessNum,3,3),'-',substring(a.businessNum, 6, 5)) as BusinessNumber
        , a.businessName as BusinessName
        , concat(substring(a.openTime,1,5), '~', substring(a.closeTime,1,5)) as BusinessHours
        , a.restaurantInfo as RestaurantInfo
        , a.foodInfo as FoodInfo
from Restaurant a
left join ( select roadAddress
                    , detailAddress
                    , latitude
                    , longtitude
                    , restaurantId
                from RestaurantAddress ) as b
                on a.id = b.restaurantId
where a.id = ?;`;
    const [restaurantInfoRows] = await connection.query(selectRestaurantInfoQuery, restaurantId);
    return restaurantInfoRows;
}

module.exports = {
    sortNewRestaurant,
    sortStarGradeRestaurant,
    sortOrderCountRestaurant,
    cancelHelped,
    selectRestaurantByCategoryId,
    selectUserByReviewId,
    updateReviewHelpNum,
    selectReviewByChargeId,
    addReview,
    selectReviewByPeriod,
    selectHelpedStatus,
    changeHelpedStatus,
    updateRestaurantReview,
    getReviews,
    getOrdersFood,
    getRestaurantMainInfo,
    getSmallCategory,
    getMenuInCategory,
    getSomeReview,
    getRestaurantImageUrl,
    selectCheetahDeliveryRestaurant,
    selectDeliveryRestaurant,
    selectResImage,
    selectNonPhotoReview,
    selectNonReviews,
    selectNonPhotoReviewMenu,
    selectNotHelpedByUser,
    selectNotHelpedStatus,
    changeNotHelpedStatus,
    addNotHelped,
    cancelNotHelped,
    selectRestaurantInfo,
};