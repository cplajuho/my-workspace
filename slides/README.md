# 블로그 이미지 슬라이드 생성기 (공인노무사 김주호)

블로그 원고(워드파일) 내용을 1080×1080 이미지 슬라이드(PNG)로 만든다.

- 첫 장(표지): 프로필 사진 + 제목 + 부제. 모든 주제에서 같은 디자인
- 마지막 장(상담 안내): 프로필 사진 + 메시지 + 상담문의 010-6856-6623. 모든 주제에서 같은 디자인
- 중간 장: 글자는 최소화하고 그림(이모지 일러스트)·도식 위주

## 사용법

```bash
cd slides
npm install                      # 처음 한 번 (폰트 설치)
node render.js decks/sample_퇴직금.json
# → output/sample_퇴직금/01.png ~ 08.png
```

## 표지·마지막 장 디자인

- 기본: 검정·브라운 바탕 + 금색 포인트, 제목 글꼴 **고운바탕**, 연락처 바에 금색 원형 스마트폰 아이콘
- `cover.font`: `gowun`(기본) · `sans`(Pretendard Black) · `nanum`(나눔명조) · `noto`(Noto Serif)
- 인물은 왼쪽, 제목·문구는 오른쪽. 오른쪽 아래 빈 공간에 한국공인노무사회 로고를 금색으로 흐리게 넣는다
  (로고 준비: `python3 slides/fetch_logo.py` — 공식 홈페이지에서 받아 가공, 저장소에는 올리지 않음)
- `theme`: 생략하면 기본 디자인. 다른 시안 `navy` · `light` · `forest` · `wine` 도 쓸 수 있다 (themes.js)

## 덱 파일(decks/*.json) 형식

- `cover.title`, `cover.subtitle`: 표지 제목/부제. `[[단어]]`는 금색 강조, `\n`은 줄바꿈
- `cover.size`: 제목 글자 크기(px). 제목이 길어 넘칠 때만 지정
- `closing.message`, `closing.sub`: 생략하면 기본 문구 사용
- `slides`: 중간 슬라이드 목록. `type`별 필드

| type | 용도 | 주요 필드 |
|---|---|---|
| statement | 핵심 한 문장 + 큰 그림 | emoji, head, caption |
| number | 숫자 강조 (기한·금액) | emoji, pre, value, unit, caption |
| compare | O/X 비교 | head, items[{ok, emoji, label, text}] |
| steps | 절차 흐름 (3~4단계) | head, items[{emoji, label, text}] |
| checklist | 체크리스트 (2~5개) | head, items[{emoji, label, text}] |
| formula | 계산식 | head, items[{emoji, label}], ops, caption |
| photo | 실사 사진 + 문구 | image(assets 경로), head, caption |

모든 중간 슬라이드는 `topic`(상단 작은 제목)을 받는다.

## 프로필 사진 교체

```bash
python3 slides/cutout.py 새사진.jpg slides/assets/profile_full.png
```
흰색·회색 단색 배경 사진만 자동으로 배경을 지울 수 있다.
