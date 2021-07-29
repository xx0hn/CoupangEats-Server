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
    where id = ?`;
    const [existAddressRows] = await connection.query(rmAddressInfoResultQuery, userId, addressId);
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
module.exports = {
    selectAddress,
    rmAddressInfo,
    additAddressInfo
};