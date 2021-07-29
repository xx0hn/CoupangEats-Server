// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT email, nickname 
                FROM UserInfo;
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

// 이메일로 회원 조회
async function selectUserEmail(connection, email) {
  const selectUserEmailQuery = `
                SELECT email, nickname 
                FROM UserInfo 
                WHERE email = ?;
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, email);
  return emailRows;
}

// userId 회원 조회
async function selectUserId(connection, userId) {
  const selectUserIdQuery = `
                 SELECT id, email, nickname 
                 FROM UserInfo 
                 WHERE id = ?;
                 `;
  const [userRow] = await connection.query(selectUserIdQuery, userId);
  return userRow;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO UserInfo(email, password, nickname)
        VALUES (?, ?, ?);
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
        SELECT email, nickname, password
        FROM UserInfo 
        WHERE email = ? AND password = ?;`;
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
        FROM UserInfo 
        WHERE email = ?;`;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      email
  );
  return selectUserAccountRow[0];
}

async function updateUserInfo(connection, id, nickname) {
  const updateUserQuery = `
  UPDATE UserInfo 
  SET nickname = ?
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

// async function selectUserFavorites(connection, userIdFromJWT) {
//   const query=`
//         select  a.userId
//                 , a.restaurantId as 식당id
//                 , b.name as 식당명
//                 , concat(h.imageUrl) as 식당사진
//                 , case when cheetaDel = 1 then '치타배달' else '일반배달' end as 배달유형
//                 , round(sum(f.score) / count(e.id), 1) as 별점
//                 , chargeCount as 리뷰수
//                 , (6371*acos(cos(radians(g.latitude))*cos(radians(c.latitude))*cos(radians(c.longtitude)-radians(g.longtitude))+sin(radians(g.latitude))*sin(radians(c.latitude)))) AS 거리
//                 , b.delTime as 최소배달시간
//                 , b.maxDelTime as 최대배달시간
//                 , b.delCost as 배달비
// from Favorites a
// left join ( select id
//                     , name
//                     , cheetaDel
//                     , delTime
//                     , maxDelTime
//                     , delCost
//                 from Restaurant ) as b
//                 on a.restaurantId = b.id
// left join ( select restaurantId
//                     , longtitude
//                     , latitude
//                 from RestaurantAddress ) as c
//                 on a.restaurantid = c.restaurantId
// left join ( select id
//                     , userId
//                     , restaurantId
//                     , chargeId
//                 from Orders
//                  group by userId) as d
//                  on a.restaurantId = d.restaurantId
// left join ( select id
//                     , restaurantId
//                     , count(id) as 'chargeCount'
//                 from Charge
//                 group by id ) as e
//                 on e.id = d.chargeId
// left join (  select id
//                     , chargeId
//                         , userId
//                         , score
//                 from Review
//                 group by chargeId, userId) as f
//                 on e.id = f.chargeId
// left join ( select userId
//                     , longtitude
//                     , latitude
//                 from UserAddress ) as g
//                  on a.userId = g.userId
// left join ( select restaurantId
//                     , imageUrl
//                 from RestaurantImageUrl
//                 group by restaurantId ) as h
//                 on a.restaurantId = h.restaurantId
// where a.userId = ?;`;
//   const [favoritesRows] = await connection.query(query);
//   return favoritesRows;
// }

module.exports = {
  selectUser,
  selectUserEmail,
  selectUserId,
  insertUserInfo,
  selectUserPassword,
  selectUserAccount,
  updateUserInfo,
  selectUser1,
  // selectUserFavorites,
};
