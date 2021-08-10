//유저가 작성한 리뷰 조회
async function selectUserReviews(connection, userId, restaurantId){
  const selectUserReviewQuery=`
  select a.id as id
        , b.id as RestaurantId
        , b.name as RestaurantName
        , a.score as StarGrade
        , a.imageUrl as ReviewImage
        , a.contents as ReviewComment
        , date_format(a.createdAt, "%Y-%m-%d") as CreatedDate
        , case when helpedCount is null then 0 else helpedCount end as ReviewHelpedCount
        , case when notHelpedCount is null then 0 else notHelpedCount end as ReviewNotHelpedCount
from Review a
left join ( select id
                    , name
                from Restaurant ) as b
                on a.restaurantId = b.id
left join ( select id
                    , userId
                    , reviewId
                    , count(case when status ='ACTIVE' and reviewId is not null then 1 end ) as 'helpedCount'
                from Helped
                group by reviewId) as c 
                on a.id = c.reviewId
left join ( select id
                    , userId
                    , reviewId
                    , count(case when status = 'ACTIVE' and reviewId is not null then 1 end ) as 'notHelpedCount'
                from NotHelped
                group by reviewId ) as d
                on a.id = d.reviewId
where a.userId = ? and a.restaurantId = ? ;`;
  const [selectUserReviewRows] = await connection.query(selectUserReviewQuery, [userId, restaurantId]);
  return selectUserReviewRows;
}

//리뷰의 메뉴 조회
async function selectMenuInfo(connection, userId, reviewId){
  const selectMenuInfoQuery=`
  select e.id as MenuId
        , e.name as MenuName
        , c.menuCount as MenuCount
from Menu a
left join ( select id
                    , chargeId
                    , userId
                    , restaurantId
                from Review ) as b
                on a.restaurantId = b.restaurantId
left join ( select id
                    , userId
                    , restaurantId
                    , chargeId
                    , menuId
                    , menuCount
                from Orders ) as c
                on b.chargeId = c.chargeId
left join ( select id
                    , restaurantId
                from Charge ) as d
                on b.chargeId = d.id
left join ( select id
                    , name
                from Menu ) as e
                on c.menuId = e.id
where b.userId = ? and b.id = ?
group by e.id;`;
  const [menuInfoRows] = await connection.query(selectMenuInfoQuery, [userId, reviewId]);
  return menuInfoRows;
}

// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT email, name 
                FROM User;
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}
//매장id로 회원 조회
async function selectUserRestaurantId(connection,userId, restaurantId){
  const selectUserRestaurantIdQuery=`
                SELECT restaurantId, userId 
                FROM Favorites
                WHERE userId = ? and restaurantId = ?;`;
  const [userRestaurantRows] = await connection.query(selectUserRestaurantIdQuery,[userId, restaurantId]);
  return userRestaurantRows;
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
    insert into User(email, password, name, phoneNum)
    values (?, ?, ?, ?);
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
    select email as email
         , name as name
         , password as password
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
//전화번호 수정
async function updateUserPhoneNum(connection, editInfo, userId) {
  const updateUserQuery = `
  UPDATE User 
  SET phoneNum = ?
  WHERE id = ?;`;
  const [updateUserRow] = await connection.query(updateUserQuery, [editInfo, userId]);
  return updateUserRow;
}
//비밀번호 수정
async function updateUserPassWord(connection, hashedPassword, userId) {
  const updateUserQuery = `
  UPDATE User 
  SET password = ?
  WHERE id = ?;`;
  const [updateUserRow] = await connection.query(updateUserQuery, [hashedPassword, userId]);
  return updateUserRow;
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
where a.userId= ? and a.status = 'ACTIVE'
group by a.restaurantId
order by orderCount desc;`;
  const [userFavoritesRows] = await connection.query(selectUsersFavoritesResultQuery, userId);
  return userFavoritesRows;
}

//즐겨찾기 항목 삭제
async function updateFavoritesList(connection,userId, favoritesId){
  const updateFavoritesListQuery =`
  update Favorites
set status = 'DELETED'
where userId = ? and id = ?;`;
  const [existFavoritesRows] = await connection.query(updateFavoritesListQuery,[userId, favoritesId]);
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
        , case when a.status = 'ACTIVE' then '배달완료' else '배달취소' end as 'Status'
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
             when c.delCost = 0 then sum(a.menuCount * b.cost) - e.benefits
             else sum(a.menuCount * b.cost) + c.delCost - e.benefits end as TotalPrice
    from Orders a
           left join (select id
                           , cost
                      from Menu) as b
                     on a.menuId = b.id
           left join (select id
                           , delCost
                      from Restaurant) as c
                     on a.restaurantId = c.id
            left join ( select couponId
                            , id
                        from Charge ) as d
                        on a.chargeId = d.id
            left join ( select id
                            , benefits
                        from Coupon ) as e
                        on d.couponId = e.id
    where a.userId = ?
      and chargeId = ?;
                `;
  const [totalPriceRows] = await connection.query(query, [userId, chargeId]);
  return totalPriceRows;
}

//검색 순위 조회
async function selectSearchRank(connection){
  const selectSearchRankQuery=`
  select row_number() over (order by count(categoryId) desc ) as SearchRanking
            , name as Search
            , count(categoryId) as SearchCount
from Search
group by categoryId;`;
  const [searchRankRows] = await connection.query(selectSearchRankQuery);
  return searchRankRows;
}

//영수증 정보 조회
async function selectReceiptsInfo(connection, userId, chargeId){
  const selectReceiptsInfoQuery=`
  select a.id as id
            , a.restaurantId as RestaurantId
            , b.name as RestaurantName
            , a.createdAt as ChargeTime
            , g.name as BankName
            , concat(left(f.cardNum, 4), '****') as CardNum
from Charge a
left join ( select id
                    , name
                    , delCost
                from Restaurant ) as b
                on a.restaurantId = b.id
left join ( select id
                    , userId
                    , restaurantId
                    , chargeId
                    , menuId
                    , menuCount
                from Orders ) as c
                on a.id = c.chargeId
left join ( select id
                    , name
                    , restaurantId
                    , cost
                from Menu ) as d
                on c.menuId = d.id
left join ( select id
                    , userId
                    , benefits
                from Coupon ) as e
                on c.userId = e.userId
left join ( select id
                    , cardNum
                    , bankId
                from Card ) as f
                on a.cardId = f.id
left join ( select id
                    , name
                from Bank ) as g
                on f.bankId = g.id
where c.userId = ? and a.id = ?
group by c.userId;`;
  const [receiptsRows] = await connection.query(selectReceiptsInfoQuery, [userId, chargeId]);
  return receiptsRows;
}

//영수증 음식 조회
async function selectReceiptsMenu(connection, chargeId){
  const selectReceiptsMenuQuery=`
  select a.id as MenuId
            , a.name as MenuName
            , b.menuCount as MenuCount
            , concat(format(a.cost*b.menuCount, 0),'원') as MenuCost
from Menu a
left join ( select id
                    , userId
                    , restaurantId
                    , chargeId
                    , menuId
                    , menuCount
                from Orders ) as b
                on a.id = b.menuId
left join ( select id
                from Charge ) as c
                on b.chargeId = c.id
where c.id = ?;`;
  const [receiptsMenuRows] = await connection.query(selectReceiptsMenuQuery, chargeId);
  return receiptsMenuRows;
}

//영수증 금액 조회
async function selectReceiptsPrice(connection, chargeId){
  const selectReceiptsPriceQuery=`
  select concat(format(sum(b.menuCount*a.cost), 0), '원') as OrderCost
            , concat(format(d.delCost, 0), '원') as DeliveryCost
            , case when e.benefits is null then concat(0, '원') else concat(format(e.benefits,0),'원') end as DiscountCost
            , concat(format(sum(b.menuCount*a.cost)+d.delCost-e.benefits, 0), '원') as TotalCost
from Menu a
left join ( select id
                    , userId
                    , restaurantId
                    , chargeId
                    , menuId
                    , menuCount
                from Orders ) as b
                on a.id = b.menuId
left join ( select id
                    , couponId
                from Charge ) as c
                on b.chargeId = c.id
left join ( select id
                    , delCost
                from Restaurant ) as d
                on b.restaurantId = d.id
left join ( select id
                    , benefits
                from Coupon ) as e
                on c.couponId = e.id
where c.id = ?;`;
  const [totalCostRows] = await connection.query(selectReceiptsPriceQuery, chargeId);
  return totalCostRows;
}



//사용자 카드 조회
async function selectUserCardList(connection, userId){
  const selectUserCardListQuery=`
  select a.userId as UserId
        , a.id as CardId
        , b.name as BankName
        , concat('****', right(a.cardNum, 4)) as CardNum
from Card a
left join ( select id
                    , name
                from Bank ) as b
                on a.bankId = b.id
where a.userId = ? and a.status = 'ACTIVE';`;
  const [userCardsRows] = await connection.query(selectUserCardListQuery, userId);
  return userCardsRows;
}

//사용자 카드 등록
async function postUserCard(connection, userId, bankId, cardNum){
  const postUserCardQuery=`
     insert into Card(userId, bankId, cardnum)
    values (?,?,?);`;
  const [userCardRows] = await connection.query(postUserCardQuery, [userId, bankId, cardNum]);
  return userCardRows;
}

//사용자 카드 삭제
async function patchUserCard(connection, cardId){
  const patchUserCardQuery=`
    update Card
    set status = 'DELETED'
    where id = ?;`;
  const [patchCardRows] = await connection.query(patchUserCardQuery, [cardId]);
  return patchCardRows;
}

//카드 번호로 사용자 조회
async function selectUserCardNum(connection, userId, bankId, cardNum){
  const selectUserCardNumQuery=`
                SELECT cardNum, userId 
                FROM Card
                WHERE userId = ? and bankId = ? and cardNum = ?;`;
  const [userCardNumRows] = await connection.query(selectUserCardNumQuery, [userId, bankId, cardNum]);
  return userCardNumRows;
}

//소셜 로그인 유저 생성
async function insertSocialUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO User(name, email, loginStatus)
        VALUES ( ?, ?, ?);
    `;
  const insertUserInfoRow = await connection.query(insertUserInfoQuery, insertUserInfoParams);
  return insertUserInfoRow;
}

//사용자 id, 전화번호로 조회
async function userPhoneNum(connection, editInfo, userId){
  const userPhoneNumQuery=`
      select id
      from User
      where phoneNum = ? and id = ?;`;
  const [userPhoneRows] = await connection.query(userPhoneNumQuery, [editInfo, userId]);
  return userPhoneRows;
}

//사용자 id, 비밀번호로 조회
async function selectPassword(connection,idHashedPWParams){
  const checkPasswordQuery=`
      select id
      from User
      where password = ? and id = ?;`;
  const [userPasswordRows] = await connection.query(checkPasswordQuery,idHashedPWParams);
  return userPasswordRows;
}

//회원탈퇴
async function patchUserStatus(connection, userId){
  const patchUserStatusQuery=`
  update User
  set status = 'DELETED'
  where id = ?;`;
  const [patchUserStatusRows] = await connection.query(patchUserStatusQuery, userId);
  return patchUserStatusRows;
}

//주문
async function postOrders(connection, userId, restaurantId, menuId, menuCount){
  const postOrdersQuery=`
  insert into Orders(userId, restaurantId, menuId, menuCount)
  values(?, ?, ?, ?);`;
  const [postOrdersRows] = await connection.query(postOrdersQuery, [userId, restaurantId, menuId, menuCount]);
  return postOrdersRows;
}

module.exports = {
  selectUserReviews,
  selectMenuInfo,
  selectUser,
  selectUserRestaurantId,
  selectUserEmail,
  selectUserPhoneNum,
  selectUserId,
  insertUserInfo,
  selectUserPassword,
  selectUserAccount,
  selectFavoritesList,
  updateFavoritesList,
  additFavoriteList,
  getOrdersInfo,
  getOrderFoods,
  getTotalPrice,
  selectSearchRank,
  selectReceiptsInfo,
  selectReceiptsMenu,
  selectReceiptsPrice,
  selectUserCardList,
  postUserCard,
  patchUserCard,
  selectUserCardNum,
  insertSocialUserInfo,
  updateUserPassWord,
  updateUserPhoneNum,
  userPhoneNum,
  selectPassword,
  patchUserStatus,
  postOrders,
};
