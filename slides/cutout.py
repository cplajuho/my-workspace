"""프로필 사진의 단색(흰/회색 스튜디오) 배경을 제거해 투명 PNG로 저장한다.

사용: python slides/cutout.py 입력.jpg 출력.png

1) 사진 가장자리에서 시작해, 배경과 이어진 '무채색에 가까운 밝은 픽셀'을 지운다(flood fill).
   - 피부는 채도가 높아 경계가 된다.
   - 흰 셔츠는 배경(완전 무채색)과 달리 살짝 푸른 기가 있어, 셔츠 영역에서는 이것으로 구분한다.
2) 경계 근처에 남은 '순수 배경색' 잡티(칼라와 어깨 사이 등)를 한 번 더 지운다.
3) 흰 배경 빛이 번진 가장자리(흰 테두리)는 바로 안쪽 색으로 눌러 어두운 배경에서도 자연스럽게 만든다.
"""
import sys
from collections import deque
import numpy as np
from PIL import Image, ImageFilter


def _blur(arr, r):
    """0~255 범위 배열을 흐리게 (PIL은 실수 이미지 블러를 지원하지 않아 8비트로 처리)."""
    im = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    return np.asarray(im.filter(ImageFilter.GaussianBlur(r))).astype(np.float32)


def _morph(mask, flt):
    return np.asarray(Image.fromarray(mask.astype(np.uint8) * 255).filter(flt)) > 127


def cutout(src, dst, sat_tol=30, blue_tol=2):
    im = Image.open(src).convert("RGB")
    a = np.asarray(im).astype(np.int16)
    h, w, _ = a.shape
    sat = a.max(2) - a.min(2)
    blue = a[..., 2] - a[..., 0]
    # 셔츠 보호(푸른 기 차단)는 가운데 아래쪽 셔츠 영역에서만 쓴다.
    yy, xx = np.mgrid[0:h, 0:w]
    shirt_zone = (yy > h * 0.33) & (xx > w * 0.40) & (xx < w * 0.63)
    cand = (sat <= sat_tol) & (a.min(2) > 110) & ((blue <= blue_tol) | ~shirt_zone)

    # 1) 가장자리에서 flood fill
    bg = np.zeros((h, w), bool)
    q = deque()
    seeds = [(y, x) for y in range(h) for x in (0, w - 1)] + [(0, x) for x in range(w)]
    for y, x in seeds:
        if cand[y, x] and not bg[y, x]:
            bg[y, x] = True; q.append((y, x))
    while q:
        y, x = q.popleft()
        for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
            if 0 <= ny < h and 0 <= nx < w and cand[ny, nx] and not bg[ny, nx]:
                bg[ny, nx] = True; q.append((ny, nx))
    fg = ~bg

    # 셔츠 영역만 닫기(close)로 칼라 가장자리의 가는 틈을 메운다
    closed = _morph(_morph(fg, ImageFilter.MaxFilter(9)), ImageFilter.MinFilter(9))
    fg = np.where(shirt_zone, closed, fg)

    # 2) 경계 12px 안의 '순수 배경색' 잡티 제거 (셔츠는 푸른 기가 있어 남는다)
    pure_bg = (sat <= 8) & (a.min(2) > 200) & (np.abs(blue) <= 1)
    near_bg = _morph(~fg, ImageFilter.MaxFilter(25))
    fg &= ~(pure_bg & near_bg)
    fg = _morph(fg, ImageFilter.MedianFilter(7))

    # 부드러운 알파: 1px 안쪽으로 줄이고 살짝 흐리게
    alpha = np.asarray(Image.fromarray(fg.astype(np.uint8) * 255)
                       .filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2)))

    # 3) 가장자리 흰 번짐 제거: 경계 띠에서는 '안쪽 색'보다 밝은 성분을 눌러준다
    inner = _morph(fg, ImageFilter.MinFilter(13))
    wgt = _blur(inner * 255.0, 6) / 255.0 + 1e-4
    rgb = a.astype(np.float32)
    inner_col = np.stack([_blur(rgb[..., c] * inner, 6) for c in range(3)], 2) / wgt[..., None]
    band = fg & ~inner & (wgt > 0.02)
    rgb = np.where(band[..., None], np.minimum(rgb, inner_col + 8), rgb)

    out = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8)).convert("RGBA")
    out.putalpha(Image.fromarray(alpha))
    bbox = Image.fromarray(alpha).point(lambda v: 255 if v > 10 else 0).getbbox()
    out = out.crop(bbox)
    out.save(dst)
    print(dst, out.size)


if __name__ == "__main__":
    cutout(sys.argv[1], sys.argv[2])
