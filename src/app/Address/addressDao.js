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
async function additAddressInfo(connection, userId, roadAddress, detailAddress, roadNavigate, latitude, longtitude){
    const additAddressInfoResultQuery=`
    insert into UserAddress(userId, roadAddress, detailAddress, roadNavigate, latitude, longtitude)
values (?, ?, ?, ?, ?, ?);`;
    const [addAddressRows] = await connection.query(additAddressInfoResultQuery, [userId, roadAddress, detailAddress, roadNavigate, latitude, longtitude]);
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

//배송지 정보로 유저 조회

module.exports = {
    selectAddress,
    rmAddressInfo,
    additAddressInfo,
    defaultAddressSetting,
    defaultAddressInfo,
};