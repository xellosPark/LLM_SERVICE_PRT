1.npm install react-router-dom@6.22.3
2.npm install --save-dev @babel/plugin-proposal-private-property-in-object
3.npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons @fortawesome/fontawesome-svg-core
4.npm install axios
5.npm install jwt-decode //JWT의 만료 시간이나 페이로드에 저장된 정보를 확인할 때 사용
6.npm i cross-env
7.npm install -g win-node-env
8.npm install react-icons

TTF와 OTF의 차이점 정리:
특징	TTF (TrueType Font)	OTF (OpenType Font)
확장자	            .ttf	                     .otf
개발사	            애플, 마이크로소프트	       어도비, 마이크로소프트
폰트 기술	        TrueType Glyph 기술만 사용	  TrueType과 PostScript 기술 모두 사용
타이포그래피 기능	 기본 기능 제공	               고급 타이포그래피 기능 제공 (리그처, 스몰캡스, 대체 문자 등)
파일 크기	        일반적으로 더 작음	           일반적으로 더 큼
호환성	            모든 운영체제에서 사용 가능	   모든 운영체제에서 사용 가능
용도	           웹, 프린팅, 일상 사용 폰트	   고급 디자인 및 타이포그래피 작업에 적합

어떤 폰트를 선택해야 할까?
일상적인 사용: 기본적인 텍스트 표현과 일상적인 용도로는 TTF로 충분합니다.
디자인과 타이포그래피: 복잡한 타이포그래피 디자인(리그처, 스몰캡스, 대체 문자 등)이 필요하다면 OTF가 더 적합합니다. OTF는 고급 디자인과 출판 작업에서 유용합니다.

//Unix 스타일의 환경 변수 설정 방식을 Windows에서 지원하도록 해주는 패키지

papckage.json 또는 터미널에서 입력
"scripts": {
  // ...
  "build": "NODE_ENV=production node index.js"
},

useContext사용하기 위해서는 로컬스토리지도 필요
*로컬스토리지만 사용하지 왜 굳이 context까지 사용하는거지?
 ->로컬스토리지는 일반 값이 저장된 형태고 context에는 상태가 저장된 것이다
   즉 , 리렌더링 작업이 필요한 컴포넌트에는 context를 사용하는 것이고 이때 새로고침이 되면 초기화가 돼버리니까 부수적으로 로컬스토리지의 힘을 잠시 빌리는 것이다