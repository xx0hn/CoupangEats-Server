# CoupangEats-Server
CoupangEats Clone Coding Project


1	  GET	/app/users/:userId/addresses	유저 배송지 조회 API
2	  GET	/app/users/:userId/reviews	유저 작성한 리뷰 조회 API
3	  GET	/app/restaurants	우선 순위 순 매장 조회 API
4	  PATCH	/app/users/:userId/helped-review	리뷰 도움 여부 취소 API
5	  PATCH	/app/users/:userId/addresses	배송지 삭제 API
6	  POST	/app/users/:userId/addresses	배송지 추가 API
7	  PATCH	/app/users/:userId/default-address	기본 배송지 설정 API
8	  GET	/app/users/:userId/favorites	즐겨찾기 조회 API
9	  PATCH	/app/users/:userId/favorites	즐겨찾기 항목 삭제 API
10	POST	/app/users/:userId/favorites	즐겨찾기 항목 추가 API
11	GET	/app/users/:userId/past-orders	과거 주문내역 조회 API
12	GET	/app/searchwords	검색으로 매장 조회 API
13	POST	/app/users/:userId/helped-review	리뷰 도움 여부 증가 API
14	POST	/app/users/:userId/reviews	매장 리뷰 생성 API
15	PATCH	/app/users/:userId/reviews	매장 리뷰 수정 API
16	GET	/app/restaurants/:restaurantId/reviews	매장 리뷰 조회 API
17	POST	/app/signup	회원가입 API
18	POST	/app/login	로그인 API
19	GET	/app/restaurants/:restaurantId/main	매장 메인 화면 조회 API
20	GET	/app/searchwords/rank	검색 순위 조회 API
21	GET	/app/restaurants/delivery-types	배달 유형 별 매장 조회 API
22	GET	/app/users/:userId/receipts	유저 영수증 조회 API
23	POST	/app/users/:userId/not-helped	리뷰 도움 안됨 여부 증가 API
24	PATCH	/app/users/:userId/not-helped	리뷰 도움 안됨 여부 취소 API
25	GET	/app/users/:userId/cards	사용자 카드 조회 API
26	POST	/app/users/:userId/cards	사용자 카드 등록 API
27	PATCH	/app/users/:userId/cards	사용자 카드 삭제 API
28	GET	/app/auto-login	자동 로그인 API
29	POST	/app/login/kakao	카카오 로그인 API
30	GET	/app/restaurants/:restaurantId/info	매장 정보 조회 API
31	PATCH	/app/users/:userId/info	유저 개인정보 수정 API
32	PATCH	/app/users/:userId/withdrawal	회원탈퇴 API
33	GET	/app/restaurants/amount-cheetah	5초마다 치타배달 가능 매장 수  조회 스케줄러 API
34	POST	/app/users/:userId/orders	주문 API
35	GET	/app/push	푸시 알람 API (app token 없어 실행 안됨)
