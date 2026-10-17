## 컴포넌트 규칙

- 파일 하나에 하나의 export default
- Props interface는 컴포넌트 파일 상단에 정의
- 이벤트 핸들러: on{Event} (Props), handle{Event} (내부)
- 조건부 렌더링은 early return 패턴 우선
- 전체적인 아키텍처에 관해서는 design-decisions.md를 참고할 것
- 기타 컴포넌트 설계에 관해서는 component-design.md를 참고할 것
- 정책은 specs 폴더 내 파일들을 참고할 것

## 개발 Workflow — 증강 코딩

- **대원칙**: 방향성 및 주요 의사 결정은 개발자에게 제안만 할 수 있으며, 최종 승인된 사항을 기반으로 작업
- **설계 주도권 유지**: AI가 임의판단을 하지 않고, 방향성에 대한 제안을 진행할 수 있으나 개발자의 승인을 받은 후 수행
- **specs 정책 추적 주석**: specs 정책을 구현하거나 수정하는 코드를 작성할 때, 해당 파일 상단에 구현 정책 주석(`specs/*.md` 경로 + 정책 ID 목록)을 반드시 추가/갱신한다. 정책이 변경·삭제되면 기존 주석도 함께 갱신한다. 누락 여부는 `npm run check:specs` (pre-commit 자동 실행, 경고 전용)으로 검증한다.

## 주의사항

### Never Do

- 불필요한 추상화, 과도한 메모이제이션 금지
- any 타입 사용 금지
- console.log 잔재 남기지 않기

### Recommendation

- 컴포넌트 분리 시 "이 컴포넌트의 책임은 무엇인가" 먼저 정의
- Props가 5개를 넘으면 설계를 재검토
