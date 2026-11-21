"""Gemini 이미지 모델로 슬라이드용 AI 실사 이미지를 만든다.

사용: python3 slides/gen_image.py "프롬프트(영문 권장)" slides/assets/gen/파일명.png [모델]

- API 키는 작업 환경(Network secrets)에 저장돼 있고, 요청할 때 프록시가 자동으로 넣어준다.
  그래서 이 스크립트에는 키가 없다 (Authorization 헤더 값은 자리표시자).
- OpenAI 호환 엔드포인트(chat/completions)를 쓴다. 응답 안의 이미지(data URI 또는 base64)를 찾아 저장한다.
"""
import base64
import json
import re
import sys
import urllib.request

URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
DEFAULT_MODEL = "gemini-3.1-flash-image"

STYLE = (" Photorealistic editorial photograph, natural Korean setting and people, soft warm lighting, "
         "shallow depth of field, clean composition with empty space at the bottom for a caption, "
         "square 1:1. Absolutely no text, letters, logos or watermarks in the image.")


def _find_images(obj):
    """응답 JSON 어디에 있든 base64 이미지 문자열을 찾아 돌려준다."""
    found = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k in ("b64_json", "data") and isinstance(v, str) and len(v) > 1000:
                found.append(v)
            else:
                found += _find_images(v)
    elif isinstance(obj, list):
        for v in obj:
            found += _find_images(v)
    elif isinstance(obj, str):
        for m in re.finditer(r"data:image/[a-z]+;base64,([A-Za-z0-9+/=]+)", obj):
            found.append(m.group(1))
    return found


def generate(prompt, out, model=DEFAULT_MODEL):
    body = {"model": model, "messages": [{"role": "user", "content": "Generate an image: " + prompt + STYLE}]}
    req = urllib.request.Request(URL, data=json.dumps(body).encode(), headers={
        "Authorization": "Bearer proxy-injected", "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=180) as r:
            data = json.load(r)
    except urllib.error.HTTPError as e:
        msg = e.read().decode(errors="replace")[:400]
        raise SystemExit(f"이미지 생성 실패 ({e.code}): {msg}")
    imgs = _find_images(data)
    if not imgs:
        raise SystemExit("응답에 이미지가 없습니다: " + json.dumps(data, ensure_ascii=False)[:400])
    with open(out, "wb") as f:
        f.write(base64.b64decode(imgs[0]))
    print(out)


if __name__ == "__main__":
    generate(sys.argv[1], sys.argv[2], *(sys.argv[3:4]))
