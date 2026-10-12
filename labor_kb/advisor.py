"""노무사 페르소나로 자료를 검색해 가며 답변하는 상담 엔진."""

from __future__ import annotations

import json
from datetime import date
from typing import Callable

import anthropic

from .index import KnowledgeBase

MODEL = "claude-opus-5-5"
EFFORT = "high"  # 법률 자문은 정확도가 중요하므로 high. 비용을 줄이려면 "medium"
MAX_TOOL_ROUNDS = 12

SYSTEM_PROMPT = """\
당신은 노동법 자문을 전문으로 하는 15년 차 공인노무사입니다. 사업주·인사담당자·근로자의 질문에 \
자문 의견서를 쓰듯 정확하고 실무적으로 답합니다. 서비스 이름은 '노동법지식in'입니다.

## 자료 활용 원칙
- 답변 전에 반드시 search_documents 도구로 자료 폴더를 검색하세요. 쟁점이 여러 개면 쟁점별로 \
검색하고, 동의어(예: 해고/징계해고/부당해고, 연차/연차유급휴가)로도 검색하세요.
- 검색 결과의 앞뒤 문맥이 필요하면 read_pages로 해당 쪽을 직접 읽으세요.
- 자료에서 확인한 내용은 문장 끝에 [자료명 p.쪽] 형식으로 출처를 붙이세요.
- 자료에 없는 내용을 일반 지식으로 보완할 때는 "(자료 외 일반론)"이라고 구분해 표시하세요. \
조문 번호·판례 번호·금액·기간은 확실하지 않으면 지어내지 말고 "확인 필요"라고 적으세요.
- 자료끼리 내용이 다르면(개정 전후 등) 더 최신 자료를 우선하고 차이를 설명하세요.

## 답변 형식 (간결하게, 한국어)
- 묻는 말에 대한 핵심 답부터 1~3문장으로. 서론·쟁점 정리·장황한 설명은 쓰지 마세요.
- 근거는 핵심 2~4개만 짧은 글머리표로, 출처를 붙여서.
- 사례·계산은 꼭 필요할 때만 한 줄로. 계산 문제는 산식과 결과만.
- 결론이 사실관계에 따라 달라지면 확인할 것을 한 줄로만 묻기.
- 질문자가 더 자세히 요청할 때만 상세 검토(법령→판례·행정해석→적용→실무 권고)로 답하세요.
위법한 회피 방법은 안내하지 마세요.

마지막 줄에는 "※ 사실관계에 따라 결론이 달라질 수 있습니다." 한 줄만 넣으세요.
"""

TOOLS = [
    {
        "name": "search_documents",
        "description": (
            "자료 폴더(노동법 실무서, 행정해석, 판례 자료 등)를 키워드로 검색합니다. "
            "핵심 법률 용어 위주의 짧은 질의가 잘 찾아집니다. 예: '연차휴가 미사용수당 퇴직', '통상임금 정기상여금'."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "검색어"},
                "document": {"type": "string", "description": "특정 자료 이름(일부)으로 범위를 좁힐 때만 사용"},
                "top_k": {"type": "integer", "description": "결과 개수(기본 8, 최대 15)"},
            },
            "required": ["query"],
            "additionalProperties": False,
        },
        "eager_input_streaming": True,
    },
    {
        "name": "read_pages",
        "description": "특정 자료의 쪽을 원문 그대로 읽습니다(한 번에 최대 10쪽). 검색 결과의 앞뒤 문맥 확인용.",
        "input_schema": {
            "type": "object",
            "properties": {
                "document": {"type": "string", "description": "자료 이름(검색 결과에 표시된 이름)"},
                "start_page": {"type": "integer"},
                "end_page": {"type": "integer"},
            },
            "required": ["document", "start_page", "end_page"],
            "additionalProperties": False,
        },
        "eager_input_streaming": True,
    },
]


class LaborAdvisor:
    def __init__(self, kb: KnowledgeBase, client: anthropic.Anthropic | None = None):
        self.kb = kb
        self.client = client or anthropic.Anthropic()
        self.messages: list = []  # 대화 기록(추가만 하고 수정하지 않는다)

    def reset(self) -> None:
        self.messages = []

    def ask(
        self,
        question: str,
        on_text: Callable[[str], None] = lambda s: print(s, end="", flush=True),
        on_status: Callable[[str], None] = lambda s: print(f"\n  🔎 {s}", flush=True),
    ) -> str:
        """질문 하나에 답한다. 답변 텍스트를 스트리밍으로 on_text에 흘려보내고, 최종 답변을 반환한다."""
        self.messages.append({"role": "user", "content": question})
        system = [
            {"type": "text", "text": SYSTEM_PROMPT},
            {"type": "text", "text": f"## 현재 자료 폴더 목록\n{self.kb.summary()}\n\n오늘 날짜: {date.today():%Y-%m-%d}"},
        ]

        answer_parts: list[str] = []
        for _ in range(MAX_TOOL_ROUNDS):
            with self.client.beta.messages.stream(
                model=MODEL,
                max_tokens=64000,
                system=system,
                tools=TOOLS,
                messages=self.messages,
                thinking={"type": "adaptive"},
                output_config={"effort": EFFORT},
                cache_control={"type": "ephemeral"},
                betas=["server-side-fallback-2026-07-01"],
                fallbacks="default",
            ) as stream:
                for text in stream.text_stream:
                    on_text(text)
                    answer_parts.append(text)
                response = stream.get_final_message()

            self.messages.append({"role": "assistant", "content": response.content})

            if response.stop_reason == "refusal":
                msg = "\n[답변이 거절되었습니다. 질문 표현을 바꿔 다시 시도해 주세요.]"
                on_text(msg)
                return "".join(answer_parts) + msg
            if response.stop_reason == "max_tokens":
                on_text("\n[답변이 너무 길어 중간에 끊겼습니다. '이어서'라고 입력하면 계속합니다.]")
                break
            if response.stop_reason != "tool_use":
                break

            results = [
                self._run_tool(block, on_status)
                for block in response.content
                if block.type == "tool_use"
            ]
            self.messages.append({"role": "user", "content": results})
            if answer_parts and not answer_parts[-1].endswith("\n"):
                on_text("\n")
                answer_parts.append("\n")

        return "".join(answer_parts)

    # ------------------------------------------------------------------ 도구 실행
    def _run_tool(self, block, on_status) -> dict:
        try:
            args = block.input if isinstance(block.input, dict) else json.loads(block.input)
            if block.name == "search_documents":
                query = args.get("query")
                if not isinstance(query, str) or not query.strip():
                    raise ValueError("query가 비어 있습니다")
                on_status(f"자료 검색: {query}")
                top_k = min(int(args.get("top_k") or 8), 15)
                hits = self.kb.search(query, top_k=top_k, doc_filter=args.get("document"))
                content = (
                    "\n\n---\n\n".join(f"[{h.chunk.doc} p.{h.chunk.page}]\n{h.chunk.text}" for h in hits)
                    if hits else "검색 결과가 없습니다. 다른 용어(동의어, 상위 개념)로 다시 검색해 보세요."
                )
            elif block.name == "read_pages":
                doc, start, end = args["document"], int(args["start_page"]), int(args["end_page"])
                on_status(f"원문 확인: {doc} p.{start}-{end}")
                content = self.kb.read_pages(doc, start, end)
            else:
                raise ValueError(f"알 수 없는 도구: {block.name}")
            return {"type": "tool_result", "tool_use_id": block.id, "content": content}
        except (KeyError, ValueError, TypeError, json.JSONDecodeError) as e:
            return {"type": "tool_result", "tool_use_id": block.id, "content": f"오류: {e}", "is_error": True}
