//유저의 배송지 조회
async function selectAddress(connection, userId){
    const selectAddressResultQuery=`
    select userId as UserId
             , id as AddressId
            , roadAddress as RoadAddress
            , detailAddress as DetailAddress
            , defaultStatus as DefaultAddress
from UserAddress 
where userId = ? and status = 'ACTIVE'`;
    const [addressRows] = await connection.query(selectAddressResultQuery, userId);
    return addressRows;
}

//유저의 배송지 삭제
async function rmAddressInfo(connection, userId, addressId){
    const rmAddressInfoResultQuery=`
    update UserAddress
    set status = 'DELETED'
    where userId = ? and id = ?`;
    const [existAddressRows] = await connection.query(rmAddressInfoResultQuery, [userId, addressId]);
    return existAddressRows;
}

//유저의 배송지 추가
async function additAddressInfo(connection, userId, roadAddress, detailAddress, roadNavigate, latitude, longtitude, setStatus){
    const additAddressInfoResultQuery=`
    insert into UserAddress(userId, roadAddress, detailAddress, roadNavigate, latitude, longtitude, setStatus)
values (?, ?, ?, ?, ?, ?, ?);`;
    const [addAddressRows] = await connection.query(additAddressInfoResultQuery, [userId, roadAddress, detailAddress, roadNavigate, latitude, longtitude, setStatus]);
    return addAddressRows;
}

//유저의 모든 배송지 NOT 설정
async function defaultAddressSetting(connection, userId){
    const defaultAddressSettingQuery=`
    update UserAddress
    set defaultStatus = 'NOT'
    where userId = ?;`;
    const [defaultAddressSettingRows] = await connection.query(defaultAddressSettingQuery, userId);
    return defaultAddressSettingRows;
}

//유저의 배송지 설정
async function defaultAddressInfo(connection, userId, addressId){
    const defaultAddressResultQuery=`
    update UserAddress
set defaultStatus = 'DEFAULT'
where userId = ? and id = ?;`
    const [defaultAddressRows] = await connection.query(defaultAddressResultQuery, [userId, addressId]);
    return defaultAddressRows;
}

//setStatus가 같은 것이 있는지 확인
async function selectHomeAddress(connection, userId, setStatus){
    const selectHomeAddressQuery=`
    select id
    from UserAddress
    where userId = ? and setStatus = ?;`;
    const [homeAddressRows] = await connection.query(selectHomeAddressQuery, [userId, setStatus]);
    return homeAddressRows;
}

//setStatus가 같은 것을 모두 NOT으로 변경
async function homeAddressNot (connection, userId, setStatus){
    const homeAddressNotQuery=`
    update UserAddress
    set setStatus = 'NOT'
    where userId = ? and setStatus = ?;`;
    const [notHomeAddressRows] = await connection.query(homeAddressNotQuery, [userId, setStatus]);
    return notHomeAddressRows;
}

module.exports = {
    selectAddress,
    rmAddressInfo,
    additAddressInfo,
    defaultAddressSetting,
    defaultAddressInfo,
    selectHomeAddress,
    homeAddressNot,
};