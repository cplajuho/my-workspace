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

## 덱 파일(decks/*.json) 형식

- `cover.title`, `cover.subtitle`: 표지 제목/부제. `[[단어]]`는 금색 강조, `\n`은 줄바꿈
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
