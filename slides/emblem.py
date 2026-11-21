"""노무사회 엠블럼(투명 배경 PNG)을 슬라이드 배경용 금색 단색으로 바꾸고 2배로 키운다.

사용: python3 slides/emblem.py 엠블럼원본.png
결과: slides/assets/kcplaa_emblem_gold.png  (공식 마크라 저장소에는 올리지 않음)
"""
import os
import sys
from PIL import Image

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets", "kcplaa_emblem_gold.png")
GOLD = (227, 196, 138)

src = Image.open(sys.argv[1]).convert("RGBA")
alpha = src.getchannel("A").resize((src.width * 2, src.height * 2), Image.LANCZOS)
out = Image.new("RGBA", alpha.size, GOLD + (0,))
out.putalpha(alpha)
out.save(OUT)
print(OUT, out.size)
