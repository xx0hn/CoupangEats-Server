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
module.exports = {
    selectCategory,
    selectNewRestaurant,
    selectReviewRestaurant,
};