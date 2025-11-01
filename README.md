# classic-hub 🎵

흩어져 있는 클래식 공연 정보를 한곳에 모아 편리하게 탐색할 수 있는 웹 서비스입니다. KOPIS(공연예술통합전산망) API와 Google Gemini AI를 활용하여 데이터를 수집 및 가공하고, 사용자 친화적인 인터페이스를 통해 제공하는 것을 목표로 합니다.

## ✨ 주요 기능

**Backend & Automation:**

* **⚙️ 데이터 자동 수집 및 업데이트:** GitHub Actions를 이용한 Cron Job으로 매일 자정 KOPIS API로부터 최신 공연 정보를 자동으로 가져옵니다.
* **🤖 AI 기반 프로그램 정보 추출:** Google Gemini API (Vision/Text)를 활용하여 공연 포스터 이미지 또는 텍스트 설명에서 작곡가, 작품명 등 프로그램 정보를 추출합니다. (텍스트 데이터 우선 처리 로직 포함)
* **💾 안정적인 데이터 저장:** Supabase (PostgreSQL) 데이터베이스에 공연 정보 및 사용자 데이터를 안전하게 저장하고 관리합니다.

**Frontend (구현 예정):**

* **📅 공연 정보 조회:** 기간별, 지역별 등 다양한 조건으로 클래식 공연 정보를 조회할 수 있습니다.
* **🔍 상세 검색:** 공연명, 작곡가, 공연장 등 키워드를 기반으로 원하는 공연을 정확하게 검색합니다.
* **📊 가격 범위 필터링:** 사용자가 원하는 가격대의 공연만 필터링하여 볼 수 있습니다. 
* **👤 사용자 인증:** 이메일 기반 회원가입 및 로그인 기능을 제공합니다.
* **❤️️ 공연 찜하기:** 관심 있는 공연을 찜 목록에 저장하고 관리할 수 있습니다. (로그인 필요)
* **📱 반응형 웹 디자인:** 데스크톱, 태블릿, 모바일 등 다양한 기기에서 최적화된 화면을 제공합니다.

## 🛠️ 기술 스택

* **Frontend:** React, TypeScript
* **Backend / Scripts:** Node.js, TypeScript, ts-node
* **Database:** Supabase (PostgreSQL)
* **Authentication:** Supabase Auth
* **AI:** Google Gemini API
* **Automation:** GitHub Actions
* **External APIs:** KOPIS (공연예술통합전산망) API

## 🏗️ 아키텍처

이 서비스는 자동화된 데이터 파이프라인과 사용자 인터페이스로 구성됩니다.

1.  **GitHub Actions**가 매일 자정 스케줄에 따라 Node.js 스크립트를 실행합니다.
2.  스크립트는 **KOPIS API**로부터 공연 기본 정보 및 업데이트된 정보를 가져옵니다.
3.  필요한 경우, 공연 상세 이미지 URL 또는 텍스트 데이터를 **Google Gemini API**로 보내 프로그램 정보를 추출합니다.
4.  가공된 최종 데이터는 **Supabase PostgreSQL 데이터베이스**에 저장(upsert)됩니다.
5.  **프론트엔드 애플리케이션**(React)은 사용자의 요청에 따라 **Supabase** 데이터베이스를 직접 조회하여 공연 정보를 화면에 표시합니다. Supabase Auth를 통해 사용자 인증 및 찜하기 기능을 구현합니다.

---
