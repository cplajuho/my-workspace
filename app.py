"""노동법지식in — 웹 화면.  실행: streamlit run app.py"""

from pathlib import Path

import streamlit as st

from labor_kb import KnowledgeBase, LaborAdvisor

BASE = Path(__file__).resolve().parent

st.set_page_config(page_title="노동법지식in", page_icon="⚖️", layout="wide")


@st.cache_resource(show_spinner="자료를 읽는 중입니다... (처음 한 번만 오래 걸립니다)")
def load_kb() -> KnowledgeBase:
    kb = KnowledgeBase(BASE / "자료", BASE / ".index")
    kb.build(progress=lambda _: None)
    return kb


kb = load_kb()
if "advisor" not in st.session_state:
    st.session_state.advisor = LaborAdvisor(kb)
    st.session_state.history = []

with st.sidebar:
    st.header("📚 자료 목록")
    st.markdown(kb.summary())
    for w in kb.warnings:
        st.warning(w)
    if st.button("🔄 자료 다시 읽기"):
        load_kb.clear()
        st.session_state.clear()
        st.rerun()
    if st.button("🆕 새 상담"):
        st.session_state.advisor.reset()
        st.session_state.history = []
        st.rerun()

st.title("⚖️ 노동법지식in")
st.caption("노무사 자문 상담 — 자료 폴더의 실무서·행정해석을 근거로 답변합니다.")

for role, text in st.session_state.history:
    with st.chat_message(role, avatar="🙋" if role == "user" else "👩‍⚖️"):
        st.markdown(text)

if question := st.chat_input("예) 5인 미만 사업장도 연차휴가를 줘야 하나요?"):
    st.session_state.history.append(("user", question))
    with st.chat_message("user", avatar="🙋"):
        st.markdown(question)

    with st.chat_message("assistant", avatar="👩‍⚖️"):
        status = st.status("자료를 검토하는 중...", expanded=False)
        box = st.empty()
        buf: list[str] = []

        def on_text(t: str) -> None:
            buf.append(t)
            box.markdown("".join(buf))

        answer = st.session_state.advisor.ask(question, on_text=on_text, on_status=status.write)
        status.update(label="자료 검토 완료", state="complete")
    st.session_state.history.append(("assistant", answer))
