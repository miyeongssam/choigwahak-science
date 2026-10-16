# 최과학 일정 (원장용 PWA)

직보·보강·수업 일정 캘린더와 반별 수업 횟수(회차). 2026 2학기 중간~기말.

- 접속: https://miyeongssam.github.io/choigwahak-science/schedule-calendar/
- [달력] · [목록]: 오늘 날짜 자동 강조·자동 스크롤, 유형별 필터(직보/보강/정규/개강/휴강)
- [회차] (2026-10-16): 반 · 달을 고르면 수업 날짜, 실제 수업 횟수, 청구 회차
- 오프라인 작동 (service worker)

## 수정 방법
- 달력 · 목록: `index.html`의 `EVENTS` 배열을 고친다.
- 회차: `index.html`의 `/*<<수업세기 데이터>>*/` 칸은 손으로 고치지 않는다. 학원 공용 표에서 도구(`일정앱_수업세기.py`)가 채운다.
- 고친 뒤 `sw.js`의 `CACHE` 버전을 올리고(지금 v5) index.html · sw.js를 commit.
