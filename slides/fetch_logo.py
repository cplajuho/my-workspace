"""한국공인노무사회 공식 홈페이지 로고를 받아 배경 워터마크용(금색 단색, 3배 확대) PNG로 만든다.

사용: python3 slides/fetch_logo.py
결과: slides/assets/kcplaa_logo_gold.png
(공식 로고 원본은 저장소에 올리지 않는다 — .gitignore 처리)
"""
import io
import os
import urllib.request
from PIL import Image, ImageFilter

SRC = "https://www.kcplaa.or.kr/data/skin/front/appData/images/common/logo.png"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets", "kcplaa_logo_gold.png")
GOLD = (227, 196, 138)
SCALE = 3


def main():
    req = urllib.request.Request(SRC, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        logo = Image.open(io.BytesIO(r.read())).convert("RGBA")
    w, h = logo.size
    alpha = logo.getchannel("A").resize((w * SCALE, h * SCALE), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.6))
    out = Image.new("RGBA", alpha.size, GOLD + (0,))
    out.putalpha(alpha)
    out.save(OUT)
    print(OUT, out.size)


if __name__ == "__main__":
    main()
