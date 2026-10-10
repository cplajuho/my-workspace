"""노동법지식in — 터미널에서 노무사에게 질문하기.

사용법:  python 상담.py
명령어:  /새상담  대화 초기화   /자료  자료 목록   /재색인  자료 다시 읽기   /종료
"""

from pathlib import Path

from labor_kb import KnowledgeBase, LaborAdvisor

BASE = Path(__file__).resolve().parent


def main() -> None:
    kb = KnowledgeBase(BASE / "자료", BASE / ".index")
    print("📚 자료를 확인하는 중...")
    kb.build()
    print(kb.summary())
    for w in kb.warnings:
        print(f"⚠️  {w}")

    advisor = LaborAdvisor(kb)
    print("\n⚖️  노동법지식in — 무엇이든 물어보세요. (/새상담 /자료 /재색인 /종료)\n")
    while True:
        try:
            q = input("🙋 질문> ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            break
        if not q:
            continue
        if q in ("/종료", "/exit", "/quit"):
            break
        if q == "/새상담":
            advisor.reset()
            print("새 상담을 시작합니다.\n")
            continue
        if q == "/자료":
            print(kb.summary() + "\n")
            continue
        if q == "/재색인":
            kb.build()
            print(kb.summary() + "\n")
            continue

        print("\n👩‍⚖️ 노무사> ", end="")
        advisor.ask(q)
        print("\n")


if __name__ == "__main__":
    main()
