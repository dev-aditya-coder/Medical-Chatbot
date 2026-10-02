import os
from dotenv import load_dotenv

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_groq import ChatGroq

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser


# Load API keys from .env
load_dotenv()

# Check that the API keys exist
if not os.getenv("GROQ_API_KEY"):
    raise ValueError("GROQ_API_KEY is missing from .env")

if not os.getenv("PINECONE_API_KEY"):
    raise ValueError("PINECONE_API_KEY is missing from .env")


# -----------------------------
# 1. HuggingFace Embeddings
# -----------------------------

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


# -----------------------------
# 2. Connect to Pinecone
# -----------------------------

index_name = "medical-chatbot"

docsearch = PineconeVectorStore.from_existing_index(
    index_name=index_name,
    embedding=embeddings
)


# -----------------------------
# 3. Create Retriever
# -----------------------------

retriever = docsearch.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 3}
)


# -----------------------------
# 4. Groq LLM
# -----------------------------

llm = ChatGroq(
    model="openai/gpt-oss-20b",
    temperature=0
)


# -----------------------------
# 5. Prompt
# -----------------------------

system_prompt = (
    "You are an assistant for question-answering tasks. "
    "Use the following pieces of retrieved context to answer "
    "the question. If you don't know the answer, say that you "
    "don't know. Use three sentences maximum and keep the "
    "answer concise."
    "\n\n"
    "Context:\n{context}"
)

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{input}"),
])


# -----------------------------
# 6. Format retrieved documents
# -----------------------------

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)


# -----------------------------
# 7. RAG Chain
# -----------------------------

rag_chain = (
    {
        "context": retriever | format_docs,
        "input": RunnablePassthrough(),
    }
    | prompt
    | llm
    | StrOutputParser()
)


# -----------------------------
# 8. Function for the frontend
# -----------------------------

def get_response(question):
    return rag_chain.invoke(question)