"""프로필 사진의 단색(흰/회색 스튜디오) 배경을 제거해 투명 PNG로 저장한다.

사용: python slides/cutout.py 입력.jpg 출력.png

배경은 채도가 거의 없는 밝은 회색(그림자 포함)이고, 피부·정장은 채도가 높거나 어둡다.
행(가로줄)마다 '배경이 아닌' 픽셀의 가장 왼쪽~오른쪽 구간을 인물로 보고 그 안은 모두 남긴다.
그래서 흰 셔츠처럼 배경과 색이 비슷한 부분도 지워지지 않는다.
"""
import sys
import numpy as np
from PIL import Image, ImageFilter


def cutout(src, dst, sat_tol=30, min_run=8):
    im = Image.open(src).convert("RGB")
    a = np.asarray(im).astype(np.int16)
    h, w, _ = a.shape
    sat = a.max(2) - a.min(2)
    bg = (sat <= sat_tol) & (a.min(2) > 110)
    fg = ~bg

    alpha = np.zeros((h, w), np.uint8)
    k = np.ones(min_run)
    for y in range(h):
        # 잡티 무시: min_run 픽셀 이상 연속된 인물 픽셀만 인정
        run = np.convolve(fg[y].astype(float), k, "same") >= min_run - 0.5
        xs = np.flatnonzero(run)
        if xs.size:
            alpha[y, xs[0]:xs[-1] + 1] = 255

    m = Image.fromarray(alpha)
    # 세로 방향 들쭉날쭉함 정리 후 경계를 부드럽게
    m = m.filter(ImageFilter.MedianFilter(7)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.5))
    out = im.convert("RGBA")
    out.putalpha(m)
    bbox = m.point(lambda v: 255 if v > 10 else 0).getbbox()
    out = out.crop(bbox)
    out.save(dst)
    print(dst, out.size)


if __name__ == "__main__":
    cutout(sys.argv[1], sys.argv[2])
