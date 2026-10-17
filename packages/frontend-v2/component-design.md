> 컴포넌트는 "재사용 가능하게" 만들기 전에, "읽기 쉽게" 만드는 것이 먼저다.

# 🚧 실무에서 겪는 문제들

<aside>
💡

프로젝트가 커지면 이런 상황을 자주 만납니다:

- "이 버튼 컴포넌트, Props가 12개인데 어떤 조합이 유효한 건지 모르겠어요"
- "카테고리 상태를 4단계 아래 컴포넌트까지 내려보내야 하는데, 중간 컴포넌트는 쓰지도 않아요"
- "같은 모양의 카드가 3곳에 있는데, 각각 다른 파일에 복사되어 있어요"
- "새 디자인 시안이 왔는데, 버튼 하나 바꾸려면 20곳을 수정해야 해요"

</aside>

이번 주에는 이런 문제들을 **컴포넌트 설계**와 **Props 전략**으로 해결하는 방법을 배웁니다.

---

# 📋 Props 설계 원칙

## 1. Props는 적을수록 좋다

> Props가 많아지면 **사용하는 쪽에서 "어떤 조합이 맞는 건지"** 혼란이 옵니다.

### 📌 실무 사례로 알아보기

```tsx
// ❌ Props 10개 — 어떤 조합이 유효한지 읽을 수 없다
<Card
  title={title}
  subtitle={subtitle}
  image={image}
  badge={badge}
  badgeColor={badgeColor}
  onClick={onClick}
  onHover={onHover}
  isNew={isNew}
  isSoldOut={isSoldOut}
  isLiked={isLiked}
/>
// 질문: badge가 없으면 badgeColor는 무시되는 건가?
// 질문: isNew와 isSoldOut이 동시에 true면 어떻게 되는가?
// 질문: onHover 없이 onClick만 있어도 되는 건가?
```

```tsx
// ✅ Composition — children으로 위임하면 조합이 명확해진다
<Card onClick={onClick}>
  <Card.Image src={image} />
  <Card.Badge variant={isNew ? "new" : "default"}>{badge}</Card.Badge>
  <Card.Title>{title}</Card.Title>
  <Card.Price value={price} />
</Card>

// Badge가 필요 없으면? → <Card.Badge> 줄을 안 쓰면 된다
// 좋아요 버튼이 필요하면? → <LikeButton />을 children에 추가하면 된다
```

> **핵심**: Props를 늘리는 대신 **children을 활용해 합성**합니다. 사용하는 쪽에서 필요한 것만 조합할 수 있습니다.

### Props 개수의 경험적 기준

| Props 수 | 판단      | 대응                                |
| -------- | --------- | ----------------------------------- |
| 1~3개    | ✅ 깔끔   | 유지                                |
| 4~5개    | ⚠️ 주의   | 관련 Props를 객체로 그룹화 검토     |
| 6개 이상 | ❌ 재설계 | Composition 패턴 또는 컴포넌트 분리 |

- **QNA — 6개 이상이면 무조건 나쁜 건가요?**
  아닙니다. HTML의 `<input>` 태그도 `type`, `value`, `onChange`, `placeholder`, `disabled`, `name` 등 Props가 많습니다. **"각 Prop이 독립적으로 의미가 있고, 조합에 모호함이 없다면"** 많아도 괜찮습니다. 문제는 **Props 간 의존 관계가 숨어있을 때**입니다 (예: `badge`가 있을 때만 `badgeColor`가 의미 있음).

---

## 2. 이벤트 핸들러 네이밍

> R1에서 배운 네이밍 규칙을 컴포넌트 Props에 적용합니다.

```tsx
// Props로 받는 콜백: on + Event
interface SearchBarProps {
  onSearch: (query: string) => void; // 외부에서 주입
  onClear?: () => void;
}

// 컴포넌트 내부 함수: handle + Event
function SearchBar({ onSearch, onClear }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent) => {
    // 내부 처리
    e.preventDefault();
    onSearch(query); // 외부 콜백 호출
  };

  const handleClear = () => {
    setQuery("");
    onClear?.();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <button type="submit">검색</button>
      <button type="button" onClick={handleClear}>
        초기화
      </button>
    </form>
  );
}
```

> **on~을 보면** "외부에서 주입된 콜백이구나", **handle~을 보면** "이 컴포넌트가 직접 처리하는 로직이구나"를 즉시 구분할 수 있습니다.

---

## 3. boolean Props — 긍정형만 사용

```tsx
// ❌ 부정형 → 이중 부정이 발생
<Button notDisabled={false} />   // "비활성화가 아닌 게 거짓"? → 활성화?

// ✅ 긍정형만 사용
<Button disabled={true} />       // 명확: 비활성화

// ❌ 모호한 이름
<Modal show={true} />            // show? isOpen? visible?

// ✅ 컨벤션 통일
<Modal isOpen={true} />          // is + 형용사 패턴
```

---

# ⚖️ Controlled vs Uncontrolled

## 값을 누가 소유하는가

> Props 설계에서 **값의 주인이 부모인지 컴포넌트 자체인지**를 먼저 정해야 합니다. 이 선택이 Props 모양(`value` vs `defaultValue`)을 결정합니다.

|                 | Controlled                                  | Uncontrolled                                 |
| --------------- | ------------------------------------------- | -------------------------------------------- |
| **상태 위치**   | 부모가 `value` • `onChange`로 제어          | 컴포넌트 내부에서 자체 관리                  |
| **초기값**      | `value` prop                                | `defaultValue` prop                          |
| **값 접근**     | 부모의 state에서 직접                       | `ref`로 접근                                 |
| **적합한 경우** | 폼 검증, 실시간 미리보기, 여러 입력 간 연동 | 간단한 입력, 파일 업로드, 성능이 중요한 경우 |
| **React 권장**  | 대부분의 경우 권장                          | 제어가 불필요하거나 성능 최적화 시           |

### 📌 실무 사례로 알아보기

```tsx
// Controlled — 실시간 검색어 표시가 필요할 때
function SearchWithPreview() {
  const [query, setQuery] = useState("");

  return (
    <div>
      <Input value={query} onChange={(e) => setQuery(e.target.value)} />
      <p>검색 중: "{query}"</p> {/* 타이핑할 때마다 실시간 반영 */}
      <SearchResults query={query} />
    </div>
  );
}

// Uncontrolled — 제출할 때만 값이 필요할 때
function SimpleLoginForm() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login(emailRef.current!.value, passwordRef.current!.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input ref={emailRef} defaultValue="" placeholder="이메일" />
      <input ref={passwordRef} type="password" placeholder="비밀번호" />
      <button type="submit">로그인</button>
    </form>
  );
}
```

### 둘 다 지원하는 컴포넌트 설계

> 좋은 공통 컴포넌트는 **Controlled와 Uncontrolled 모두 지원**합니다.

```tsx
interface InputProps {
  // Controlled
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  // Uncontrolled
  defaultValue?: string;
  // 공통
  placeholder?: string;
  disabled?: boolean;
}

function Input({ value, onChange, defaultValue, ...rest }: InputProps) {
  // value가 있으면 Controlled, 없으면 Uncontrolled
  const isControlled = value !== undefined;

  return isControlled ? (
    <input value={value} onChange={onChange} {...rest} />
  ) : (
    <input defaultValue={defaultValue} {...rest} />
  );
}
```

---

# 🔄 Props Drilling

## Props Drilling = 무조건 나쁘다?

> 아닙니다. **Props Drilling은 데이터 흐름을 추적할 수 있는 가장 단순한 방법**입니다.
> 문제는 "언제 Drilling을 유지하고, 언제 Context로 전환하는가"를 판단하는 것입니다.

### 판단 기준

| 상황                                                    | 판단       | 이유                                           |
| ------------------------------------------------------- | ---------- | ---------------------------------------------- |
| 2단계 전달 (부모 → 자식 → 손자)                         | ✅ 유지    | 흐름이 명확하고 추적 가능                      |
| 3단계 이상 + 중간 컴포넌트가 해당 Props를 사용하지 않음 | ⚠️ 검토    | 중간 컴포넌트가 불필요한 의존성을 가짐         |
| 여러 컴포넌트 트리에서 동일 상태를 공유                 | ❌ Context | 트리 구조상 Props 전달이 불가능하거나 비효율적 |

### 📌 실무 사례로 알아보기

```tsx
// Props Drilling 4단계 — 중간 컴포넌트가 그냥 "전달자" 역할만
function App() {
  const [category, setCategory] = useState("all");
  return <Layout category={category} onCategoryChange={setCategory} />;
}

function Layout({ category, onCategoryChange }) {
  // Layout은 category를 쓰지 않는다 — 그냥 전달만
  return (
    <ProductSection category={category} onCategoryChange={onCategoryChange} />
  );
}

function ProductSection({ category, onCategoryChange }) {
  // ProductSection도 category를 쓰지 않는다 — 그냥 전달만
  return <FilterBar category={category} onCategoryChange={onCategoryChange} />;
}

function FilterBar({ category, onCategoryChange }) {
  // 여기서야 비로소 사용
  return (
    <select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
      ...
    </select>
  );
}
```

**문제**: `Layout`과 `ProductSection`은 `category`를 **사용하지 않으면서 전달만** 합니다. `category`의 타입이 바뀌면 4곳을 수정해야 합니다.

```tsx
// Context로 해결
const CategoryContext = createContext<{
  category: string;
  setCategory: (cat: string) => void;
} | null>(null);

function App() {
  const [category, setCategory] = useState("all");
  return (
    <CategoryContext.Provider value={{ category, setCategory }}>
      <Layout />
    </CategoryContext.Provider>
  );
}

function Layout() {
  return <ProductSection />; // category를 전달하지 않는다
}

function ProductSection() {
  return <FilterBar />; // category를 전달하지 않는다
}

function FilterBar() {
  const { category, setCategory } = useCategoryContext();
  return (
    <select value={category} onChange={(e) => setCategory(e.target.value)}>
      ...
    </select>
  );
}
```

### Context의 올바른 포지셔닝

<aside>
💡

Context는 **앱 전역 스토어 대용이 아니지만**, **서브트리 단위의 상태 관리**에는 React 공식 문서가 권장하는 패턴입니다.
(React Docs — Scaling up with reducer and context)

다음 세 상황에서 Context를 고려하세요:

1. **Props Drilling 해소** — 중간 컴포넌트들이 데이터를 사용하지 않고 전달만 할 때
2. **서브트리 상태 공유** — 특정 계층 아래의 여러 컴포넌트가 같은 상태를 공유할 때 (예: Tabs, Form)
3. **테마/언어 설정** — 거의 변하지 않는 전역 값

</aside>

- Context 값이 **자주 바뀌면** 하위 컴포넌트 **전체가 리렌더링**된다
- "자주 바뀌는 값"과 "드물게 바뀌는 값"을 **같은 Context에 넣지 않는다**

```tsx
// ❌ 자주 바뀌는 값(inputValue)과 드물게 바뀌는 값(theme)을 한 Context에
const AppContext = createContext({
  theme: "light", // 드물게 변경
  inputValue: "", // 타이핑할 때마다 변경 → 전체 리렌더링!
});

// ✅ 변경 빈도가 다른 값은 Context를 분리
const ThemeContext = createContext({ theme: "light" });
const SearchContext = createContext({ inputValue: "" });
```

- **QNA — "그러면 Zustand 쓰면 되는 거 아닌가요?"**
  R5(상태 관리)에서 본격적으로 다룹니다. 지금 단계에서는 **"이 상태가 Props Drilling으로 충분한가, Context가 필요한가"**를 판단하는 감각을 먼저 키우는 게 목적입니다. 도구를 먼저 배우면 모든 문제를 그 도구로 풀려고 합니다. 문제를 먼저 이해하고, 그에 맞는 도구를 선택하는 순서가 중요합니다.

---

# 🧱 공통 컴포넌트 설계

## 도입 시점 판단

> **"나중에 쓸 것 같아서" 미리 만들지 않는다.** (YAGNI — You Ain't Gonna Need It)

| 상황                                     | 판단         | 이유                           |
| ---------------------------------------- | ------------ | ------------------------------ |
| 같은 UI가 **3곳 이상**에서 반복          | ✅ 공통화    | 중복 제거 효과가 명확          |
| 2곳이지만 **향후 확장이 확실**           | ✅ 공통화    | 지금 만들어두면 확장 비용 절감 |
| 1곳에서만 쓰이는데 "나중에 쓸 것 같아서" | ❌ 하지 않음 | 예측은 대부분 틀린다 (YAGNI)   |

## 공통 컴포넌트의 3가지 원칙

### 원칙 1: 비즈니스 로직을 포함하지 않는다

```tsx
// ❌ 공통 컴포넌트에 비즈니스 로직이 섞임
function ProductButton({ product }: { product: Product }) {
  const isAvailable = product.stock > 0 && product.status === 'active'
  return <button disabled={!isAvailable}>{product.name} 구매</button>
}

// ✅ 공통 컴포넌트는 UI만, 비즈니스 판단은 사용하는 쪽에서
function Button({ disabled, children, ...props }: ButtonProps) {
  return <button disabled={disabled} {...props}>{children}</button>
}

// 사용하는 쪽에서 비즈니스 로직 적용
const isAvailable = product.stock > 0 && product.status === 'active'
<Button disabled={!isAvailable}>{product.name} 구매</Button>
```

### 원칙 2: 도메인 용어를 사용하지 않는다

```tsx
ProductButton    ❌  // "상품 구매" 맥락에만 사용 가능
OrderSubmitForm  ❌  // "주문" 맥락에만 사용 가능
Button           ✅  // 어디서든 사용 가능
Form             ✅  // 어디서든 사용 가능
```

### 원칙 3: variant/size로 외양을 제어한다

```tsx
interface ButtonProps {
  /** 버튼 스타일 변형 */
  variant?: "primary" | "secondary" | "ghost" | "danger";
  /** 버튼 크기 */
  size?: "sm" | "md" | "lg";
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 로딩 상태 — true일 때 스피너 표시, 클릭 비활성화 */
  loading?: boolean;
  /** 왼쪽 아이콘 */
  leftIcon?: React.ReactNode;
  /** 클릭 핸들러 */
  onClick?: () => void;
  /** 버튼 내용 */
  children: React.ReactNode;
}
```

> **JSDoc 주석**(`/** */`)을 Props에 달아두면, IDE에서 자동완성 시 설명이 표시됩니다. 별도 문서 없이도 Props의 용도를 알 수 있습니다.

---

## children 합성의 기본 감각

> Props가 늘어날 때의 대안으로 **children에 JSX를 넘겨받는 합성**을 먼저 느껴보세요.
> **본격적인 Compound Component 패턴**(Context 기반 암시적 상태 공유—`<Tabs><Tabs.Trigger/></Tabs>`)은 R4에서 배웁니다. 여기서는 "Props 많은 컴포넌트 → children으로 조합"이라는 생각의 전환만 익히면 충분합니다.

### 왜 Props 대신 Composition인가

```tsx
// ❌ Props로 모든 것을 제어 — 변형이 늘어날 때마다 Props도 늘어남
<Card
  title="원목 스탠드 조명"
  price={45000}
  badge="신상품"
  showLikeButton
  likeCount={128}
  showReviewCount
  reviewCount={42}
  imageHeight={200}
/>
// 질문: showShareButton도 추가해달라고 하면? Props +2개...

// ✅ Composition — 사용하는 쪽에서 필요한 것만 조합
<Card>
  <Card.Image src="/lamp.jpg" alt="원목 스탠드 조명" height={200} />
  <Card.Body>
    <Card.Badge>신상품</Card.Badge>
    <Card.Title>원목 스탠드 조명</Card.Title>
    <Card.Price value={45000} />
  </Card.Body>
  <Card.Footer>
    <LikeButton count={128} />
    <ReviewCount count={42} />
  </Card.Footer>
</Card>

// ShareButton이 필요하면? → Card.Footer에 추가하면 된다
// Card 컴포넌트를 수정할 필요가 없다!
```

<aside>
💡

**Composition의 핵심 장점**: 기존 컴포넌트를 **수정하지 않고 확장**할 수 있다.
이것이 R4에서 배울 Compound Component 패턴의 기반입니다.

</aside>

---

## TypeScript Props — 고급 패턴

### 조건부 Props (Discriminated Union)

> "variant가 'icon'일 때만 icon Props가 필수" 같은 조건을 타입으로 표현

```tsx
// ❌ 모든 Props를 optional로 두면 잘못된 조합을 막을 수 없다
interface ButtonProps {
  variant: 'text' | 'icon'
  label?: string      // text일 때 필수인데 optional로 되어있음
  icon?: ReactNode     // icon일 때 필수인데 optional로 되어있음
}

// ✅ Discriminated Union(Tagged Union) — 잘못된 조합을 컴파일 타임에 차단
type ButtonProps =
  | { variant: 'text'; label: string; icon?: never }
  | { variant: 'icon'; icon: ReactNode; label?: never }

// 사용
<Button variant="text" label="확인" />     // ✅
<Button variant="icon" icon={<X />} />     // ✅
<Button variant="text" icon={<X />} />     // ❌ 컴파일 에러!
<Button variant="icon" />                  // ❌ icon 누락 에러!
```

### HTML 속성 확장 (ComponentPropsWithoutRef)

```tsx
// Button이 <button>의 모든 HTML 속성을 지원하도록
// interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>
interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

function Button({
  variant = "primary",
  size = "md",
  loading,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button disabled={loading || rest.disabled} {...rest}>
      {loading ? <Spinner /> : children}
    </button>
  );
}

// 사용하는 쪽에서 type, aria-label 등 HTML 속성을 자유롭게 전달
<Button type="submit" aria-label="주문하기" variant="primary">
  주문
</Button>;
```

- **QNA — ComponentPropsWithRef vs ComponentPropsWithoutRef?**
  `WithRef`는 `ref`를 포함하고, `WithoutRef`는 제외합니다. 일반적인 컴포넌트는 `WithoutRef`를 사용하고, `forwardRef`로 ref를 전달하는 컴포넌트만 `WithRef`를 사용합니다. 대부분의 경우 `WithoutRef`로 충분합니다.
