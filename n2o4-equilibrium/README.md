# 최과학과학전문학원 - N₂O₄ ⇌ 2NO₂ 평형 시뮬레이터 (PWA)

화학Ⅱ 평형 단원 학습용 인터랙티브 앱.
온도를 조작하면 N₂O₄ ⇌ 2NO₂ 평형이 이동하면서 기체 색이 실제처럼 변화하는 모습을 보여줌.

---

## 📁 파일 구성

| 파일 | 용도 |
|---|---|
| `index.html` | 앱 본체 (시뮬레이터 + 설치 버튼) |
| `manifest.json` | PWA 매니페스트 (앱 이름, 아이콘, 색상) |
| `service-worker.js` | 오프라인 동작 + 설치 가능 조건 |
| `icon-192.png` | 앱 아이콘 (192×192) |
| `icon-512.png` | 앱 아이콘 (512×512) |
| `README.md` | 본 가이드 |

---

## 🚀 GitHub Pages 배포 (5분 안에 완료)

### 1단계. 깃허브 레포지토리 만들기
1. https://github.com 로그인
2. 우측 상단 `+` → `New repository`
3. Repository name: `n2o4-equilibrium` (또는 원하는 이름)
4. `Public` 선택 → `Create repository`

### 2단계. 파일 6개 업로드
1. 새로 만든 레포지토리 페이지에서 `Add file` → `Upload files`
2. 이 폴더의 6개 파일 (`index.html`, `manifest.json`, `service-worker.js`, `icon-192.png`, `icon-512.png`, `README.md`) 전부 드래그
3. 하단 `Commit changes` 클릭

### 3단계. Pages 활성화
1. 레포지토리 상단 `Settings` 탭
2. 왼쪽 메뉴 `Pages`
3. `Source` → `Deploy from a branch`
4. `Branch` → `main` / `/(root)` → `Save`
5. 1~2분 후 상단에 표시되는 주소가 앱 URL
   - 예: `https://USERNAME.github.io/n2o4-equilibrium/`

---

## 🌐 학원 홈페이지 연결

홈페이지에 아래 버튼 HTML을 붙여넣기:

```html
<a href="https://USERNAME.github.io/n2o4-equilibrium/"
   target="_blank"
   style="display:inline-block;background:#6B3A05;color:#FAF6EB;
          padding:14px 24px;border-radius:10px;text-decoration:none;
          font-weight:600;font-size:15px;">
  📲 N₂O₄ 평형 시뮬레이터 실행 / 앱 설치
</a>
```

또는 QR코드 생성기 (`qr-code-generator.com` 등)에 위 URL을 넣어 QR 만들고 학원 게시판에 인쇄해 붙여두면 학생들이 폰으로 바로 접속 가능.

---

## 📲 학생용 설치 안내

### 안드로이드 (크롬)
1. 위 링크 접속
2. 화면 상단 또는 하단의 `홈 화면에 추가` 알림 탭
3. (또는) 페이지 안의 갈색 `홈 화면에 앱 설치` 버튼 탭

### 아이폰 (사파리)
1. 위 링크 접속
2. 하단 공유 버튼 ⬆️ 탭
3. `홈 화면에 추가` 선택

### PC (크롬/엣지)
1. 위 링크 접속
2. 주소창 오른쪽 `설치` 아이콘 클릭

설치 후 홈 화면에 「최과학 평형앱」 아이콘 생성됨. 인터넷 없이도 작동.

---

## 🔧 커스터마이징

- **이름 변경**: `manifest.json` 의 `name`, `short_name` 수정
- **테마색 변경**: `manifest.json` 의 `theme_color`, `index.html` 의 `--brand` 값 수정
- **시뮬레이션 수정**: `index.html` 의 `<script>` 안 `calcEquilibrium`, `N_SLOTS` 등 변경

---

## ⚠️ 주의사항
- GitHub Pages는 무료지만 PUBLIC 레포지토리여야 함
- 업데이트 후 학생들이 새 버전 받으려면 `service-worker.js` 의 `CACHE_NAME` 끝 숫자 (`v1` → `v2`) 변경 필수
- HTTPS 환경에서만 PWA 설치 가능 (GitHub Pages는 자동 HTTPS 제공)

---

© 최과학과학전문학원 · 화학Ⅱ 평형 학습 도구
