module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },

    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" }, // ?

    //Request error
    SIGNUP_EMAIL_EMPTY : { "isSuccess": false, "code": 2001, "message":"이메일을 입력해주세요" },
    SIGNUP_EMAIL_LENGTH : { "isSuccess": false, "code": 2002, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNUP_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2003, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY : { "isSuccess": false, "code": 2004, "message": "비밀번호를 입력 해주세요." },
    SIGNUP_PASSWORD_LENGTH : { "isSuccess": false, "code": 2005, "message":"비밀번호는 4~20자리를 입력해주세요." },
    SIGNUP_NICKNAME_EMPTY : { "isSuccess": false, "code": 2006, "message":"닉네임을 입력 해주세요." },
    SIGNUP_NICKNAME_LENGTH : { "isSuccess": false,"code": 2007,"message":"닉네임은 최대 20자리를 입력해주세요." },
    SIGNUP_NAME_EMPTY : { "isSuccess": false, "code": 2019, "message": "이름을 입력해주세요."},
    SIGNUP_NAME_LENGTH : { "isSuccess" : false, "code": 2020, "message": "이름은 최대 15자리를 입력해주세요. "},
    SIGNUP_PHONENUM_EMPTY : {"isSuccess": false, "code": 2021, "message": "전화번호를 입력 해주세요. "},
    SIGNUP_PHONENUM_LENGTH : {"isSuccess": false, "code": 2022, "message": "전화번호는 최대 15자리를 입력해주세요. "},
    SIGNUP_SEX_EMPTY : {"isSuccess" : false, "code": 2023, "message": "성별을 입력해주세요. "},
    SIGNUP_SEX_ERROR_TYPE : {"isSuccess": false, "code": 2024, "message": "성별 형식을 정확하게 입력해주세요(male, female). "},


    USER_USERID_EMPTY : { "isSuccess": false, "code": 2012, "message": "userId를 입력해주세요." },
    USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2013, "message": "해당 회원이 존재하지 않습니다." },

    USER_USEREMAIL_EMPTY : { "isSuccess": false, "code": 2014, "message": "이메일을 입력해주세요." },
    USER_USEREMAIL_NOT_EXIST : { "isSuccess": false, "code": 2015, "message": "해당 이메일을 가진 회원이 존재하지 않습니다." },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2016, "message": "유저 아이디 값을 확인해주세요" },
    USER_NICKNAME_EMPTY : { "isSuccess": false, "code": 2017, "message": "변경할 닉네임 값을 입력해주세요" },
    USER_INFO_EMPTY : {"isSuccess": false, "code": 2041, "message": "유저 정보를 입력해주세요. "},




    USER_STATUS_EMPTY : { "isSuccess": false, "code": 2018, "message": "회원 상태값을 입력해주세요" },

    ADDRESS_ID_EMPTY : { "isSuccess": false, "code": 2025, "message": "addressId를 입력해주세요. "},
    ROAD_ADDRESS_EMPTY : { "isSuccess": false, "code": 2026, "message": "roadAddress를 입력해주세요. "},
    DETAIL_ADDRESS_EMPTY : { "isSuccess": false, "code": 2027, "message": "detailAddress를 입력해주세요. "},

    FAVORITES_ID_EMPTY : { "isSuccess": false, "code": 2028, "message": "favoritesId를 입력해주세요. "},

    RESTAURANT_ID_EMPTY : {"isSuccess": false, "code": 2029, "message": "restaurantId를 입력해주세요. "},

    CATEGORY_ID_EMPTY : {"isSuccess" : false, "code" : 2030, "message": "categoryId를 입력해주세요. "},

    REVIEW_ID_EMPTY : {"isSuccess" : false, "code": 2031, "message": "reviewId를 입력해주세요. "},
    REVIEW_SCORE_EMPTY: {"isSuccess" : false, "code" : 2032, "message": "reviewScore를 입력해주세요. "},
    REVIEW_SCORE_SIZE : {"isSuccess" : false, "code" : 2033, "message": "reviewScore는 1~5입니다. "},
    REVIEW_CONTENTS_EMPTY : {"isSuccess": false, "code" : 2034, "message": "contents를 입력해주세요. "},
    REVIEW_REVIEWID_NOT_EXIST: {"isSuccess": false, "code": 2036, "message": "해당 reviewId를 가진 review가 없습니다. "},

    CHARGE_ID_EMPTY : {"isSuccess" : false, "code" : 2035, "message": "chargeId를 입력해주세요. "},

    MENU_ID_EMPTY : {"isSuccess" : false, "code": 2036, "message": "menuId를 입력해주세요. "},
    MENU_COUNT_EMPTY: {"isSuccess": false, "code": 2037, "message": "menuCount를 입력해주세요. "},

    CARD_ID_EMPTY : {"isSuccess": false, "code" : 2038, "message": "cardId를 입력해주세요. "},
    CARD_NUM_EMPTY : {"isSuccess": false, "code" : 2039, "message": "cardNum을 입력해주세요. "},

    BANK_ID_EMPTY: {"isSuccess": false, "code": 2040, "message": "bankId를 입력해주세요. "},

    LATITUDE_EMPTY: {"isSuccess": false, "code": 2041, "message": "위도를 입력해주세요. "},
    LONGTITUDE_EMPTY: {"isSuccess": false, "code": 2042, "message": "경도를 입력해주세요. "},

    PRIORITY_EMPTY:{"isSuccess": false, "code": 2043, "message": "정렬 우선순위를 입력해주세요. "},
    PRIORITY_ERROR_TYPE: {"isSuccess": false, "code": 2044, "message": "정렬 우선순위를 정확하게 입력해주세요. (NEW, STARGRADE, ORDERCOUNT) "},

    SEARCH_WORD_EMPTY: {"isSuccess": false, "code": 2045, "message": "검색어를 입력해주세요. "},

    REVIEW_TYPE_EMPTY: {"isSuccess": false, "code": 2046, "message": "리뷰 타입을 입력해주세요. "},
    REVIEW_TYPE_NOT_MATCH: {"isSuccess": false, "code": 2047, "message": "리뷰 타입을 정확히 입력해주세요. (PHOTO, NON-PHOTO) "},

    DELIVERY_TYPE_EMPTY:{"isSuccess": false, "code": 2048, "message": "배달 유형을 입력해주세요. "},
    DELIVERY_TYPE_NOT_MATCH:{"isSuccess": false, "code": 2049, "message": "배달 유형을 정확히 입력해주세요. (CHEETAH, ALL)"},

    // Response error
    SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3001, "message":"중복된 이메일입니다." },
    SIGNUP_REDUNDANT_PHONENUM : { "isSuccess": false, "code": 3002, "message":"중복된 전화번호입니다." },

    SIGNIN_EMAIL_WRONG : { "isSuccess": false, "code": 3003, "message": "아이디가 잘못 되었습니다." },
    SIGNIN_EMAIL_EMPTY : { "isSuccess": false, "code": 3004, "message": "아이디을 입력해주세요" },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3005, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 3006, "message": "비밀번호를 입력 해주세요." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3007, "message": "비활성화 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3008, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },

    SIGNOUT_EMAIL_WRONG : {"isSuccess": false, "code": 3009, "message": "아이디가 잘못 되었습니다. "},
    SIGNOUT_PASSWORD_WRONG : { "isSuccess": false, "code": 3010, "message": "비밀번호가 잘못 되었습니다." },

    REDUNDANT_RESTAURANT_ID : {" isSuccess": false, "code": 3011, "message": "중복된 매장입니다. "},
    REDUNDANT_CARD_NUM: {"isSuccess": false, "code":3012, "message": "중복된 카드입니다. "},
    REDUNDANT_ADDRESS: {"isSuccess": false, "code":3013, "message": "중복된 주소입니다. "},
    REDUNDANT_HELPED_REVIEWID:{"isSuccess": false, "code":3014, "message": "이미 도움 버튼이 눌려있습니다.  "},
    REDUNDANT_CHARGE_ID_REVIEW:{"isSuccess": false, "code":3015, "message": "이미 리뷰가 작성되었습니다.  "},
    REUNDANT_NOT_HELPED_REVIEW: {"isSuccess": false, "code":3016, "message": "이미 도움 안됨 버튼이 눌려있습니다.  "},

    CANNOT_UPDATE_REVIEW:{"isSuccess": false, "code":3016, "message": "수정 가능 기간이 아닙니다. "},
    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
 
 
}
