# 최과학 일정 (원장용 PWA)

직보·보강·수업 일정 캘린더. 2026 2학기 중간~기말 확정본(2026-09-28) 내장.

- 접속: https://miyeongssam.github.io/choigwahak-science/schedule-calendar/
- 오늘 날짜 자동 강조·자동 스크롤, 유형별 필터(직보/보강/정규/개강/휴강)
- 오프라인 작동 (service worker)

## 일정 수정 방법
`index.html`의 `EVENTS` 배열에서 항목 추가·수정 후, `sw.js`의 `CACHE` 버전을 v2, v3…으로 올려서 commit.
