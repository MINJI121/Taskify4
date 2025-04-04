<div style="text-align: center;">
  <a href="https://taskify-theta-plum.vercel.app/">
    <img alt="Taskify" src='public/images/landing_hero.png' width="350" height="200">
  </a>
</div>

- Taskify 일정관리 서비스
- 개발 기간 : 25.03.18 ~ 25.04.04

# Team

### 황혜진

- 팀장
- 공통 컴포넌트 Button, Modal을 크기 및 버튼 개수 설정 등 유동적인 UI로 구성
- 주요 컴포넌트 작성: Card, CardList, Column
- CardList, Column의 스크롤 바닥 감지를 통한 무한 스크롤 기능 구현
- [dashboardId]index에서 칼럼 및 카드 데이터 동적 렌더링
- 카드 생성 / 삭제 / 상세조회 기능을 포함한 모달 기반 UI 작성 (AddColumnModal, ColumnDeleteModal, ColumnManageModal)
- 프로젝트 초기 컨벤션(파일명, 커밋 메시지, 브랜치 네이밍 등) 설정 및 팀 내 공유


### 임용균

- 프로젝트 세팅
- 컴포넌트 작성 Input, SideMenu, TodoModal, TaskModal
- 페이지 작성 landing, MyDashboard
- SideMenu 접기/펴기 기능 및 반응형
- MyDashboard Page 검색어 기반 필터링 및 페이지네이션 연동
- TodoModal, TaskModal Api 연동 및 업로드 기능 구현


### 조민지

- Style: globals.css, custom toast
- 컴포넌트 작성 Gnb
- 페이지 작성 login/signup
- login/logout 전역 상태 관리 -Zustand, UseAuthGuard
- mydashboard에 대시보드 편집 모드 추가
- 대시보드 멤버 목록 드롭다운 메뉴 기능
- 404 페이지 작성
- QA


### 김교연

- 컴포넌트 작성 invited/ MemberList, inviteRecords, invitedDashBoard, card, Modal
- invitedDashBoard 검색, 무한스크롤, 데이터 별 컴포넌트 분리
- MemberList 프로필이미지 출력, Modal 대시보드 이름 변경 기능
- 카드 프로필 및 비밀번호 변경
- 대시보드 수정 페이지- 이름 변경, 구성원 관리, 대시보드 초대, 삭제 기능 디자인 및 기능
- toast 알람으로 피드백 추가

### 정종우

- apiRoutes 설정
- 컴포넌트 작성 ModalDashBoard, Button(card, Columns,Todo)
- 페이지 작성 mypage
- mypage 프로필 변경, 비밀번호 변경 기능 작성
- 대시보드 카드 모달 삭제기능


# Images

https://github.com/user-attachments/assets/64c0e04f-a5da-42c0-a576-1f27519447fb



# Skill Stacks

## Environment



<img alt="Git" src ="https://img.shields.io/badge/Git-f05032.svg?&style=for-the-badge&logo=Git&logoColor=white"/> <img alt="GitHub" src ="https://img.shields.io/badge/GitHub-181717.svg?&style=for-the-badge&logo=GitHub&logoColor=white"/> <img alt="VSCode" src ="https://img.shields.io/badge/VSCode-007acc.svg?&style=for-the-badge&logo=visualstudiocode&logoColor=white"/> <img alt="Vercel" src ="https://img.shields.io/badge/Vercel-000000.svg?&style=for-the-badge&logo=Vercel&logoColor=white"/> <img alt="Figma" src ="https://img.shields.io/badge/Figma-f24e1e.svg?&style=for-the-badge&logo=Figma&logoColor=white"/>



## Development



<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white"> <img alt="Tailwind CSS" src ="https://img.shields.io/badge/Tailwind_CSS-06B6D4.svg?&style=for-the-badge&logo=tailwindcss&logoColor=white"/> <img alt="TypeScript" src ="https://img.shields.io/badge/TypeScript-3178C6.svg?&style=for-the-badge&logo=TypeScript&logoColor=white"/> <img alt="Next.js" src ="https://img.shields.io/badge/Next.js-000000.svg?&style=for-the-badge&logo=Next.js&logoColor=white"/>

## Libraries

<img alt="Axios" src ="https://img.shields.io/badge/Axios-5429e4.svg?&logo=Axios&logoColor=white&style=for-the-badge"/> <img alt="clsx" src ="https://img.shields.io/badge/clsx-CB3837.svg?&style=for-the-badge"/> 


# Package Structure


```
taskify
├─ public
│  ├─ svgs                  # 아이콘 리소스
│  └─ images                # 이미지 리소스
├─ src
│  ├─ api                   # API 사용을 위한 세팅
│  ├─ components            # 주요 컴포넌트
│  ├─ constants             #
│  ├─ hocks                 # 인증, 모달 컨텍스트 프로바이더
│  ├─ pages                 # 커스텀 훅
│  ├─ shared                #
|  ├─ store                 #
├─ styles
│  └─ globals.css           # 폰트
└─ types                    # 스타일
```

# Installation

1. Clone the repository

```bash
git clone https://github.com/part3-4team-Taskify
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm start dev
```

4. Open the project in your browser

```bash
http://localhost:3000
```
