// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT email, name 
                FROM User;
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

// 이메일로 회원 조회
async function selectUserEmail(connection, email) {
  const selectUserEmailQuery = `
                SELECT email, name 
                FROM User
                WHERE email = ?;
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, email);
  return emailRows;
}

async function selectUserPhoneNum(connection, phoneNum){
  const selectUserPhoneNumQuery =`
                SELECT phoneNum, name 
                FROM User
                WHERE phoneNum = ?;`;
  const [phoneNumRows] = await connection.query(selectUserPhoneNumQuery, phoneNum);
  return phoneNumRows;
}

// userId 회원 조회
async function selectUserId(connection, userId) {
  const selectUserIdQuery = `
                 SELECT id, email, name 
                 FROM User
                 WHERE id = ?;
                 `;
  const [userRow] = await connection.query(selectUserIdQuery, userId);
  return userRow;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
    insert into User(email, password, name, phoneNum, sex)
    values (?, ?, ?, ?, ?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );
  return insertUserInfoRow;
}

// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
    select email
         , name
         , password
    from User
    where email = ?
      and password = ?;`;
  const selectUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      selectUserPasswordParams
  );

  return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, email) {
  const selectUserAccountQuery = `
        SELECT status, id
        FROM User 
        WHERE email = ?;`;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      email
  );
  return selectUserAccountRow[0];
}

async function updateUserInfo(connection, id, nickname) {
  const updateUserQuery = `
  UPDATE User 
  SET name = ?
  WHERE id = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [nickname, id]);
  return updateUserRow[0];
}
async function selectUser1(connection) {
  const selectUserListQuery1 = `
        select id, name, email, phoneNum
        from User;`;
  const [userRows1] = await connection.query(selectUserListQuery1);
  return userRows1;
}

//유저 즐겨찾기 목록 조회
async function selectFavoritesList(connection, userId) {
  const selectUsersFavoritesResultQuery = `
  select  a.userId 
        , a.restaurantId as RestaurantId
        , b.name as RestaurantName
        , concat(h.imageUrl) as RestaurantImage
        , case when cheetaDel = 1 then '치타배달' else '일반배달' end as DeliveryType
        , starGrade as StarGrade
        , reviewCount as ReviewCount
        , round((6371*acos(cos(radians(g.latitude))*cos(radians(c.latitude))*cos(radians(c.longtitude)-radians(g.longtitude))+sin(radians(g.latitude))*sin(radians(c.latitude)))),1) AS Distance
        , b.delTime as DeliveryTIme
        , b.maxDelTime as MaxDeliveryTime
        , b.delCost as DeliveryCost
        , orderCount as OrderCount
from Favorites a
left join ( select id
                    , name
                    , cheetaDel
                    , delTime
                    , maxDelTime
                    , delCost
                from Restaurant ) as b
                on a.restaurantId = b.id
left join ( select restaurantId
                    , longtitude
                    , latitude
                from RestaurantAddress ) as c
                on a.restaurantid = c.restaurantId
left join ( select id
                    , userId
                    , restaurantId
                    , chargeId
                    , round(count(userId)/count(chargeId),0) as 'orderCount'
                from Orders 
                group by userId) as d
                on a.restaurantId = d.restaurantId
left join ( select id
                    , restaurantId
                from Charge 
                group by id ) as e
                on e.id = d.chargeId
left join (  select id
                    , chargeId
                    , userId
                    , score
                    , round(sum(score)/count(restaurantId), 1) as 'starGrade'
                    , count(restaurantId) as 'reviewCount'
                from Review 
                group by chargeId, userId) as f
                on e.id = f.chargeId
left join ( select userId
                    , longtitude
                    , latitude
                from UserAddress ) as g
                on a.userId = g.userId
left join ( select restaurantId
                    , imageUrl
                from RestaurantImageUrl
                group by restaurantId ) as h
                on a.restaurantId = h.restaurantId
where a.userId= ?
group by a.restaurantId
order by orderCount desc;`;
  const [userFavoritesRows] = await connection.query(selectUsersFavoritesResultQuery, userId);
  return userFavoritesRows;
}

//즐겨찾기 항목 삭제
async function updateFavoritesList(connection, userId, favoritesId){
  const updateFavoritesListQuery =`
  update Favorites
set status = 2
where userId = ? and id = ?;`;
  const [existFavoritesRows] = await connection.query(updateFavoritesListQuery, userId, [favoritesId]);
  return existFavoritesRows;
}

//즐겨찾기 항목 추가
async function additFavoriteList(connection, userId, restaurantId){
  const additFavoriteListQuery =`
  insert into Favorites(userId, restaurantId)
values (?, ?);`;
  const [addFavoritesRows] = await connection.query(additFavoriteListQuery, [userId, restaurantId]);
  return addFavoritesRows;
}


// 과거 주문 내역 조회(상품 제외 조회)
async function getOrdersInfo(connection, userId) {
  const query = `
    select a.id
         , b.id as RestaurantId
         , b.name as RestaurantName
         , concat(i.imageUrl) as RestaurantImage
         , date_format(a.createdAt, "%y-%m-%d") as OrderDate
         , case when date_format(a.createdAt, "%H") > 12 then '오후' else '오전' end as Noon
         , case when date_format(a.createdAt, "%H") > 12 then +date_format(a.createdAt, "%h:%i") else +date_format(a.createdAt, "%h:%i") end as 'Time'
        , case when a.status = 0 then '배달완료' else '배달취소' end as 'Status'
         , case when (6371*acos(cos(radians(e.latitude))*cos(radians(h.latitude))*cos(radians(h.longtitude)-radians(e.longtitude))+sin(radians(e.latitude))*sin(radians(h.latitude)))) > 350 then '주문불가' else '주문가능' end as Available
    from Charge a
           left join ( select id
                            , name
                            , delCost
                       from Restaurant ) as b
                     on a.restaurantId = b.id
           left join ( select id
                            , userId
                            , restaurantId
                            ,chargeId
                            , menuId
                            , menuCount
                       from Orders ) as c
                     on a.id = c.chargeId
           left join ( select id
                            , restaurantId
                            , imageUrl
                       from RestaurantImageUrl ) as d
                     on a.restaurantId = d.restaurantId
           left join ( select id
                            , userId
                            , latitude
                            , longtitude
                            , status
                       from UserAddress ) as e
                     on c.userId = e.userId
           left join ( select id
                            , name
                            , cost
                       from Menu ) as f
                     on c.menuId = f.id
           left join ( select id
                            , userId
                            , benefits
                            , status
                       from Coupon ) as g
                     on a.couponId = g.id
           left join ( select id
                            , restaurantId
                            , latitude
                            , longtitude
                       from RestaurantAddress ) as h
                     on a.restaurantId = h.restaurantId
           left join ( select id
                            , restaurantId
                            , imageUrl
                       from RestaurantImageUrl) as i
                     on b.id = i.restaurantId
    where c.userId = ?
    group by a.id;`;
  const [orderInfoRows] = await connection.query(query, userId);
  return orderInfoRows;
}

// 과거 주문 내역 조회(상품 조회)
async function getOrderFoods(connection, userId, chargeId) {
  const query = `
    select c.name as MenuName
         , a.menuCount as MenuCount
    from Orders a
           left join ( select id
                            , restaurantId
                       from Charge ) as b
                     on a.chargeId = b.id
           left join ( select id
                            , name
                            , restaurantId
                       from Menu ) as c
                     on a.menuId = c.id
    where a.userId = ? and b.id = ?;
                `;
  const [foodsRows] = await connection.query(query, [userId, chargeId]);
  return foodsRows;
}

// 과거 주문 내역 조회(합계 가격)
async function getTotalPrice(connection, userId, chargeId) {
  const query = `
    select case
             when c.delCost = 0 then sum(a.menuCount * b.cost)
             else sum(a.menuCount * b.cost) - c.delCost end as TotalPrice
    from Orders a
           left join (select id
                           , cost
                      from Menu) as b
                     on a.menuId = b.id
           left join (select id
                           , delCost
                      from Restaurant) as c
                     on a.restaurantId = c.id
    where a.userId = ?
      and chargeId = ?;
                `;
  const [totalPriceRows] = await connection.query(query, [userId, chargeId]);
  return totalPriceRows;
}





module.exports = {
  selectUser,
  selectUserEmail,
  selectUserPhoneNum,
  selectUserId,
  insertUserInfo,
  selectUserPassword,
  selectUserAccount,
  updateUserInfo,
  selectFavoritesList,
  updateFavoritesList,
  additFavoriteList,
  getOrdersInfo,
  getOrderFoods,
  getTotalPrice,
};
