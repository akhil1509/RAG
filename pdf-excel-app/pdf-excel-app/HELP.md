AI RAG Document Assistant
An AI-powered document question-answering application built with Java
21, Spring Boot 4, Spring AI, Groq, Ollama, PostgreSQL, PGVector, and
React.

Upload PDF or Excel documents and ask questions in natural language. The
application extracts and chunks document text, creates vector
embeddings, stores them in PGVector, retrieves relevant content through
semantic search, and uses Groq to generate context-aware answers.
Features
- Upload PDF, XLS, and XLSX documents.
- Extract text from PDF and Excel files.
- Split extracted text into smaller chunks.
- Generate embeddings using Ollama.
- Store document chunks and vectors in PostgreSQL with PGVector.
- Retrieve relevant chunks using semantic similarity search.
- Generate answers using a Groq-hosted language model.
- Chat with uploaded documents through a React interface.
- Render Markdown responses, including tables and lists.
- Test backend APIs using Swagger UI.
  Technology Stack
  Layer               Technology
  Language            Java 21
  Backend             Spring Boot 4.x
  AI integration      Spring AI 2.x
  Chat model          Groq
  Embedding model     Ollama
  Database            PostgreSQL
  Vector extension    PGVector
  Frontend            React, JavaScript, Vite
  PDF processing      Apache PDFBox
  Excel processing    Apache POI
  Build tool          Maven
  API documentation   Springdoc / Swagger UI
  Architecture and RAG Workflow
1. The user uploads a PDF or Excel document from the React application.
2. The Spring Boot API extracts its text.
3. TokenTextSplitter divides the text into smaller chunks.
4. Ollama creates an embedding for each chunk.
5. Spring AI stores the chunks, metadata, and embeddings in PostgreSQL
   PGVector.
6. The user submits a question through the chat interface.
7. The backend creates an embedding for the question and performs a
   similarity search in PGVector.
8. The most relevant chunks are assembled into context.
9. The context and question are sent to the Groq chat model.
10. The generated answer is returned to the React application and
    displayed in the chat.
    React UI
    |
    | Upload PDF / Excel
    v
    Spring Boot Document API
    |
    v
    Text Extraction -> Text Chunking
    |
    v
    Ollama Embeddings
    |
    v
    PostgreSQL + PGVector

React Chat -> RAG API -> Question Embedding
|
v
PGVector Search
|
Relevant Chunks
|
v
Groq LLM
|
v
AI Answer -> React UI
Project Structure
The exact structure may differ as the project evolves. The main backend
packages include:
pdf-excel-app/
├── src/
│   └── main/
│       ├── java/com/example/pdf_excel_app/
│       │   ├── config/
│       │   ├── controller/
│       │   ├── loader/
│       │   ├── service/
│       │   └── PdfExcelAppApplication.java
│       └── resources/
│           └── application.yml
├── rag-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
└── README.md
Prerequisites
Install or configure the following:
- JDK 21
- Maven
- Node.js and npm
- PostgreSQL with the PGVector extension
- Ollama
- A Groq API key
  Configuration
  Configure your database, Ollama embedding model, and Groq API key in
  src/main/resources/application.yml.

Example configuration (adjust property names to match your project's
dependencies and configuration):
server:
port: 8080

spring:
datasource:
url: jdbc:postgresql://localhost:5433/ragdb
username: postgres
password: ${DB_PASSWORD:root}

ai:
ollama:
base-url: http://localhost:11434
embedding:
options:
model: nomic-embed-text

    openai:
      api-key: ${GROQ_API_KEY}
      base-url: https://api.groq.com/openai
      chat:
        options:
          model: openai/gpt-oss-20b
Important: Spring AI property names and model identifiers depend
on the exact Spring AI version and provider configuration. Keep the
configuration that has already been tested successfully in your
application. Do not commit real API keys or database passwords to
GitHub. Set GROQ_API_KEY and DB_PASSWORD as environment variables.

Start Ollama
Make sure Ollama is running, then pull the embedding model used by your
configuration:
ollama pull nomic-embed-text
ollama list
Ollama normally listens on http://localhost:11434.
PostgreSQL and PGVector
Create the database (if it does not already exist):
CREATE DATABASE ragdb;
Connect to ragdb and ensure the PGVector extension is installed:
CREATE EXTENSION IF NOT EXISTS vector;
The PostgreSQL server must have the PGVector extension installed before
this SQL command can succeed. A PostgreSQL Docker image that includes
PGVector can be used for local development.
Run the Backend
From the backend project directory:
mvn clean spring-boot:run
The backend is expected to run at:
http://localhost:8080
Swagger UI (when Springdoc is configured):
http://localhost:8080/swagger-ui/index.html
Run the React Frontend
Open a second terminal:
cd rag-frontend
npm install
npm run dev
Vite normally serves the frontend at:
http://localhost:5173
API Endpoints
The current frontend/backend integration uses these endpoints:
Method                  Endpoint                      Purpose
POST                    /api/documents/upload       Upload a PDF or Excel
document
POST                    /api/rag/ask?question=...   Ask a question about
uploaded documents
The upload endpoint accepts multipart/form-data with the file field
expected by the controller (currently file). The RAG endpoint accepts
the question as a request parameter and returns the generated answer as
text.

Example question endpoint:
curl -X POST "http://localhost:8080/api/rag/ask?question=Summarize%20the%20uploaded%20document"
Testing the Application
1. Start PostgreSQL with PGVector enabled.
2. Start Ollama and confirm the embedding model is available.
3. Set the Groq API key and database credentials.
4. Start the Spring Boot backend.
5. Start the React frontend.
6. Open http://localhost:5173.
7. Upload a PDF or Excel file and wait for the upload-success message.
8. Ask a question about the uploaded document.
9. Check the response in the RAG chat panel.
   Current Scope and Future Improvements
   The current implementation focuses on document upload, chunking, vector
   storage, semantic retrieval, and question answering.

Potential enhancements:
- Display source document names and page numbers with answers.
- Filter retrieval by document ID or selected file.
- Add persistent conversation memory.
- Add user authentication and role-based access.
- Add document listing, preview, and deletion.
- Support more document formats.
- Add automated tests, Docker Compose, and cloud deployment.
  Troubleshooting
  Frontend shows Failed to fetch - Confirm the backend is running on
  port 8080. - Check the browser Network and Console tabs. - Confirm the
  controller's route and the frontend URL match. - Configure CORS for
  http://localhost:5173 if the frontend and backend use different
  origins.

PGVector extension is missing - Install/use a PostgreSQL
distribution or Docker image that includes PGVector. - Then run
CREATE EXTENSION IF NOT EXISTS vector; in the target database.

Ollama embedding model is unavailable - Run ollama list. - Pull
the configured model, for example ollama pull nomic-embed-text. -
Confirm the Ollama service is running at the configured base URL.

Groq authentication fails - Check that GROQ_API_KEY is set in the
backend process environment. - Do not place the key in frontend code or
commit it to source control.