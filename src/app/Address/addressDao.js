//유저의 배송지 조회
async function selectAddress(connection, userId){
    const selectAddressResultQuery=`
    select userId as UserId
             , id as AddressId
            , roadAddress as RoadAddress
            , detailAddress as DetailAddress
from UserAddress 
where userId = ? and status = 0`;
    const [addressRows] = await connection.query(selectAddressResultQuery, userId);
    return addressRows;
}

//유저의 배송지 삭제
async function rmAddressInfo(connection, userId, addressId){
    const rmAddressInfoResultQuery=`
    update UserAddress
    set status = 2
    where userId = ? and id = ?`;
    const [existAddressRows] = await connection.query(rmAddressInfoResultQuery, [userId, addressId]);
    return existAddressRows;
}

//유저의 배송지 추가
async function additAddressInfo(connection, userId, roadAddress, detailAddress){
    const additAddressInfoResultQuery=`
    insert into UserAddress(userId, roadAddress, detailAddress)
values (?, ?, ?);`;
    const [addAddressRows] = await connection.query(additAddressInfoResultQuery, [userId, roadAddress, detailAddress]);
    return addAddressRows;
}

//유저의 배송지 설정
async function defaultAddressInfo(connection, userId, addressId){
    const defaultAddressResultQuery=`
    update UserAddress
set status = 1
where userId = ? and id = ?;`
    const [defaultAddressRows] = await connection.query(defaultAddressResultQuery, [userId, addressId]);
    return defaultAddressRows;
}
module.exports = {
    selectAddress,
    rmAddressInfo,
    additAddressInfo,
    defaultAddressInfo
};