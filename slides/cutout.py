"""프로필 사진의 단색(흰/회색 스튜디오) 배경을 제거해 투명 PNG로 저장한다.

사용: python slides/cutout.py 입력.jpg 출력.png

사진 가장자리에서 시작해, 배경과 이어진 '무채색에 가까운 밝은 픽셀'만 지운다(flood fill).
- 피부: 채도가 높아 경계가 된다.
- 흰 셔츠: 배경(완전 무채색)과 달리 살짝 푸른 기(파랑-빨강 > 2)가 있어 경계가 된다.
- 목과 어깨 사이 배경도 가장자리와 이어져 있으므로 깔끔히 지워진다.
"""
import sys
from collections import deque
import numpy as np
from PIL import Image, ImageFilter


def cutout(src, dst, sat_tol=30, blue_tol=2):
    im = Image.open(src).convert("RGB")
    a = np.asarray(im).astype(np.int16)
    h, w, _ = a.shape
    sat = a.max(2) - a.min(2)
    blue = a[..., 2] - a[..., 0]
    # 셔츠 보호(푸른 기 차단)는 가운데 아래쪽 셔츠 영역에서만 쓴다.
    # 머리카락·어깨 가장자리에서는 JPEG 번짐으로 푸른 기가 생겨 흰 테두리가 남기 때문.
    yy, xx = np.mgrid[0:h, 0:w]
    shirt_zone = (yy > h * 0.33) & (xx > w * 0.40) & (xx < w * 0.63)
    cand = (sat <= sat_tol) & (a.min(2) > 110) & ((blue <= blue_tol) | ~shirt_zone)

    bg = np.zeros((h, w), bool)
    q = deque()
    for y in range(h):
        for x in (0, w - 1):
            if cand[y, x]:
                bg[y, x] = True; q.append((y, x))
    for x in range(w):
        if cand[0, x] and not bg[0, x]:
            bg[0, x] = True; q.append((0, x))
    while q:
        y, x = q.popleft()
        for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
            if 0 <= ny < h and 0 <= nx < w and cand[ny, nx] and not bg[ny, nx]:
                bg[ny, nx] = True; q.append((ny, nx))

    m = Image.fromarray(np.where(bg, 0, 255).astype(np.uint8))
    # 잡티 제거 → 경계 1px 안쪽으로 → 부드럽게
    # 닫기(close): 칼라 가장자리 같은 가는 틈 메우기 → 잡티 제거 → 경계 안쪽으로 → 부드럽게
    m = m.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.MinFilter(9))
    m = m.filter(ImageFilter.MedianFilter(7)).filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(1.4))
    out = im.convert("RGBA")
    out.putalpha(m)
    bbox = m.point(lambda v: 255 if v > 10 else 0).getbbox()
    out = out.crop(bbox)
    out.save(dst)
    print(dst, out.size)


if __name__ == "__main__":
    cutout(sys.argv[1], sys.argv[2])
