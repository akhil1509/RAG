
import { useState } from "react";

import Sidebar from "./components/Sidebar";
import FileUpload from "./components/FileUpload";
import ChatPanel from "./components/ChatPanel";

import {
  FileText,
  MessageSquare,
  Database
} from "lucide-react";

import "./App.css";

function App() {

  const [activePage, setActivePage] = useState("Dashboard");

  const [documents, setDocuments] = useState([]);

  const [backendOnline, setBackendOnline] = useState(false);

  // Called after successful upload
  const handleUploadSuccess = (result) => {

    setBackendOnline(true);

    setDocuments(prev => [
      {
        id: Date.now(),
        fileName: result.fileName,
        totalChunks: result.totalChunks
      },
      ...prev
    ]);

  };

  const handleNavigation = (page) => {

    setActivePage(page);

    const sectionId = {
      Dashboard: "dashboard",
      "AI Chat": "chat-section",
      Documents: "documents-section"
    }[page];

    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  };

  return (

    <div className="app-layout">

      <Sidebar
        activePage={activePage}
        setActivePage={handleNavigation}
      />

      <main className="main-content" id="dashboard">

        <header className="top-header">

          <div>
            <h1>AI Knowledge Workspace</h1>

            <p>
              Manage your documents and chat with your AI assistant.
            </p>
          </div>

          <div className="backend-status">
            <span className={
              backendOnline ? "status-dot" : "status-dot offline"
            }></span>

            {backendOnline ? "Backend Online" : "Backend Not Verified"}
          </div>

        </header>

        <section className="welcome-section">

          <div>
            <span className="welcome-tag">
              YOUR PERSONAL AI ASSISTANT
            </span>

            <h2>Welcome to your RAG Workspace</h2>

            <p>
              Upload PDF and Excel documents. Ask questions and get
              intelligent answers powered by Spring AI, Groq and PGVector.
            </p>
          </div>

          <div className="welcome-icon">
            <Database size={65} />
          </div>

        </section>

        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon purple">
              <FileText size={22} />
            </div>

            <div>
              <h3>{documents.length}</h3>
              <p>Uploaded Documents</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <MessageSquare size={22} />
            </div>

            <div>
              <h3>AI Ready</h3>
              <p>Chat Assistant</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">
              <Database size={22} />
            </div>

            <div>
              <h3>{backendOnline ? "Connected" : "Not Verified"}</h3>
              <p>Backend Status</p>
            </div>
          </div>

        </section>

        <section className="dashboard-grid">

          <div className="left-column" id="documents-section">

            <FileUpload
              onUploadSuccess={handleUploadSuccess}
            />

            <div className="document-list panel">

              <div className="panel-heading">
                <div>
                  <h2>Recent Documents</h2>
                  <p>Recently uploaded documents</p>
                </div>

                <FileText size={23} />
              </div>

              {documents.length === 0 ? (

                <p className="empty-documents">
                  No documents uploaded yet.
                </p>

              ) : (

                documents.map(doc => (

                  <div className="document-item" key={doc.id}>

                    <FileText size={20} />

                    <span>{doc.fileName}</span>

                    <small>
                      {doc.totalChunks} chunks
                    </small>

                  </div>

                ))

              )}

            </div>

          </div>

          <div className="right-column" id="chat-section">

            <ChatPanel />

          </div>

        </section>

        <footer className="dashboard-footer">
          RAG Assistant · Spring AI · Groq · PostgreSQL PGVector
        </footer>

      </main>

    </div>

  );

}

export default App;
