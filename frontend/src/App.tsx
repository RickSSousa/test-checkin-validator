import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, CheckCircle, AlertCircle, Loader } from "lucide-react";
import axios from "axios";

interface UploadResponse {
  success: boolean;
  message: string;
  fileIds?: string[];
  n8nResponse?: any;
}

interface FileWithPreview extends File {
  preview?: string;
  id: string;
}

const App: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [uploadMessage, setUploadMessage] = useState<string>("");
  const [uploadResponse, setUploadResponse] = useState<UploadResponse | null>(
    null
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => {
      const fileWithPreview = Object.assign(file, {
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      });
      return fileWithPreview;
    });

    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setUploadStatus("idle");
    setUploadMessage("");
    setUploadResponse(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "image/*": [".jpeg", ".jpg", ".png", ".gif"],
        "application/pdf": [".pdf"],
      },
      maxFiles: 10,
      maxSize: 10 * 1024 * 1024, // 10MB por arquivo
      onDropRejected: (fileRejections) => {
        const error = fileRejections[0]?.errors[0];
        if (error?.code === "file-too-large") {
          setUploadMessage(
            "Arquivo muito grande. Tamanho máximo: 10MB por arquivo"
          );
        } else if (error?.code === "file-invalid-type") {
          setUploadMessage(
            "Tipo de arquivo não suportado. Use apenas imagens (JPEG, PNG, GIF) ou PDF"
          );
        } else if (error?.code === "too-many-files") {
          setUploadMessage("Muitos arquivos. Máximo: 10 arquivos");
        } else {
          setUploadMessage("Erro ao selecionar arquivos");
        }
        setUploadStatus("error");
      },
    });

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploadStatus("uploading");
    setUploadMessage("Enviando arquivos...");

    const formData = new FormData();

    // Adicionar todos os arquivos
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    // Debug: verificar o FormData
    console.log("FormData criado:");
    console.log("Arquivos:", selectedFiles.length);
    selectedFiles.forEach((file, index) => {
      console.log(
        `Arquivo ${index + 1}:`,
        file.name,
        "Tamanho:",
        file.size,
        "Tipo:",
        file.type
      );
    });

    try {
      const response = await axios.post<UploadResponse>(
        "http://localhost:3001/upload",
        formData,
        {
          timeout: 60000, // 60 segundos
        }
      );

      setUploadResponse(response.data);
      setUploadStatus("success");
      setUploadMessage(response.data.message);
    } catch (error: any) {
      console.error("Erro no upload:", error);
      setUploadStatus("error");

      if (error.response?.data?.message) {
        setUploadMessage(error.response.data.message);
      } else if (error.code === "ECONNABORTED") {
        setUploadMessage("Timeout: O upload demorou muito para ser processado");
      } else {
        setUploadMessage("Erro ao enviar arquivos. Tente novamente.");
      }
    }
  };

  const handleReset = () => {
    // Limpar previews
    selectedFiles.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setSelectedFiles([]);
    setUploadStatus("idle");
    setUploadMessage("");
    setUploadResponse(null);
  };

  const removeFile = (fileId: string) => {
    setSelectedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== fileId);
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="container">
      <div className="upload-card">
        <h1 className="title">Upload de Arquivos</h1>
        <p className="subtitle">
          Faça upload de imagens (JPEG, PNG, GIF) ou PDF para processamento
          automático
        </p>

        <div
          {...getRootProps()}
          className={`upload-zone ${isDragActive ? "dragover" : ""} ${
            isDragReject ? "error" : ""
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="upload-icon" />
          <p className="upload-text">
            {isDragActive
              ? "Solte os arquivos aqui..."
              : "Arraste e solte arquivos aqui, ou clique para selecionar"}
          </p>
          <p className="upload-hint">
            Suporta: JPEG, PNG, GIF, PDF (máx. 10MB por arquivo, até 10
            arquivos)
          </p>
        </div>

        {selectedFiles.length > 0 && (
          <div className="files-preview" style={{ marginTop: "1rem" }}>
            <h3 style={{ marginBottom: "1rem", color: "#333" }}>
              Arquivos Selecionados ({selectedFiles.length})
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "1rem",
              }}
            >
              {selectedFiles.map((file) => (
                <div
                  key={file.id}
                  style={{
                    position: "relative",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    overflow: "hidden",
                    background: "#f8f9fa",
                    padding: "1rem",
                  }}
                >
                  <div className="file-name" style={{ marginBottom: "0.5rem" }}>
                    <File
                      size={16}
                      style={{ marginRight: "0.5rem", verticalAlign: "middle" }}
                    />
                    {file.name}
                  </div>
                  <div
                    className="file-details"
                    style={{
                      fontSize: "0.9rem",
                      color: "#666",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Tamanho: {formatFileSize(file.size)} | Tipo: {file.type}
                  </div>
                  {file.preview && (
                    <div style={{ marginTop: "0.5rem" }}>
                      <img
                        src={file.preview}
                        alt="Preview"
                        style={{
                          width: "100%",
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          border: "1px solid #ddd",
                        }}
                      />
                    </div>
                  )}
                  <button
                    onClick={() => removeFile(file.id)}
                    style={{
                      position: "absolute",
                      top: "0.5rem",
                      right: "0.5rem",
                      background: "rgba(231, 76, 60, 0.8)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedFiles.length > 0 && uploadStatus !== "uploading" && (
          <button
            onClick={handleUpload}
            className="upload-button"
            disabled={uploadStatus === "success"}
          >
            {uploadStatus === "success"
              ? "Arquivos Enviados!"
              : "Enviar Arquivos"}
          </button>
        )}

        {uploadStatus !== "idle" && (
          <div className={`status ${uploadStatus}`}>
            {uploadStatus === "uploading" && (
              <>
                <Loader className="loading-spinner" />
                {uploadMessage}
              </>
            )}
            {uploadStatus === "success" && (
              <>
                <CheckCircle
                  size={20}
                  style={{ marginRight: "0.5rem", verticalAlign: "middle" }}
                />
                {uploadMessage}
              </>
            )}
            {uploadStatus === "error" && (
              <>
                <AlertCircle
                  size={20}
                  style={{ marginRight: "0.5rem", verticalAlign: "middle" }}
                />
                {uploadMessage}
              </>
            )}
          </div>
        )}

        {uploadResponse && uploadResponse.success && (
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              background: "#f8f9fa",
              borderRadius: "8px",
              textAlign: "left",
            }}
          >
            <h4 style={{ marginBottom: "0.5rem", color: "#333" }}>
              Resposta do Servidor:
            </h4>
            <p style={{ marginBottom: "0.5rem" }}>
              <strong>Mensagem:</strong> {uploadResponse.message}
            </p>
            {uploadResponse.fileIds && uploadResponse.fileIds.length > 0 && (
              <p style={{ marginBottom: "0.5rem" }}>
                <strong>IDs dos Arquivos:</strong>{" "}
                {uploadResponse.fileIds.join(", ")}
              </p>
            )}
            {uploadResponse.n8nResponse && (
              <div>
                <h5 style={{ marginBottom: "0.5rem", color: "#333" }}>
                  Resposta do n8n:
                </h5>
                <pre
                  style={{
                    fontSize: "0.8rem",
                    color: "#666",
                    overflow: "auto",
                  }}
                >
                  {JSON.stringify(uploadResponse.n8nResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {(selectedFiles.length > 0 || uploadStatus !== "idle") && (
          <button
            onClick={handleReset}
            style={{
              background: "transparent",
              color: "#667eea",
              border: "1px solid #667eea",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              cursor: "pointer",
              marginTop: "1rem",
              fontSize: "0.9rem",
            }}
          >
            Limpar e Tentar Novamente
          </button>
        )}
      </div>

      <div className="footer">
        <p>
          Desenvolvido com ❤️ |
          <a
            href="http://localhost:3001/api-docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver Documentação da API
          </a>
        </p>
      </div>
    </div>
  );
};

export default App;
