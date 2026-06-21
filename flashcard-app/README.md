# 최과학 암기 플래시카드 (PWA)

학생들이 한 번만 설치하고, 매달 내용을 업데이트하면 자동으로 최신 문제로 공부할 수 있는 학습 앱입니다.

## 구조
```
flashcard-app/
├── index.html            ← 앱 본체 (거의 수정할 일 없음)
├── manifest.json         ← 설치 정보
├── sw.js                 ← 오프라인 캐시
├── icon-192.png / icon-512.png / icon-512-maskable.png
└── data/
    ├── index.json        ← 교재(차시) 목록  ← 매달 한 줄 추가
    └── set_7cha.json     ← 7차시 문제 244제  ← 매달 새 파일 추가
```

## 기능
- **OX 퀴즈**: 함정 문장 참·거짓 판단 → 정답·해설 즉시 확인, 점수·정답률, 틀린 문제 다시 풀기
- **플래시카드**: 카드를 눌러 정답·해설 확인, 섞기, 이전/다음
- 단원별 학습 + 전체 학습
- 오프라인 작동 (한 번 열면 인터넷 없이도 사용)

## 학생 접속 URL (업로드 후)
https://miyeongssam.github.io/choigwahak-science/flashcard-app/

설치: 아이폰(Safari) 공유 → "홈 화면에 추가" / 안드로이드(Chrome) 메뉴 → "홈 화면에 추가"
