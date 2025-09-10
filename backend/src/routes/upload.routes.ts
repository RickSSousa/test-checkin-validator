import express from "express";
import multer from "multer";
import axios from "axios";
import fs from "fs";
import path from "path";
import FormData from "form-data";

const router: express.Router = express.Router();

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB por arquivo
    files: 10, // Máximo 10 arquivos
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(
        new Error(
          "Apenas arquivos de imagem (JPEG, PNG, GIF) e PDF são permitidos"
        )
      );
    }
  },
});

router.post("/upload", upload.array("files", 10), async (req, res) => {
  try {
    const N8N_WEBHOOK_URL =
      process.env.N8N_WEBHOOK_URL ||
      "http://localhost:5678/webhook/upload-file";

    const files = req.files as Express.Multer.File[];

    console.log("=== UPLOAD REQUEST RECEBIDA ===");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    console.log("Files count:", files?.length || 0);

    if (!files || files.length === 0) {
      console.log("ERRO: Nenhum arquivo foi enviado");
      return res.status(400).json({
        success: false,
        message: "Nenhum arquivo foi enviado",
      });
    }

    console.log(
      "Arquivos recebidos:",
      files.map((f) => ({
        fileName: f.originalname,
        fileMimeType: f.mimetype,
        fileSize: f.size,
        filePath: f.path,
      }))
    );

    // Criar FormData para enviar ao n8n
    const formData = new FormData();

    // Adicionar arquivos ao FormData
    files.forEach((file) => {
      const fileBuffer = fs.readFileSync(file.path);
      formData.append("files", fileBuffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });
    });

    // Adicionar metadados
    formData.append("totalFiles", files.length.toString());
    formData.append("timestamp", new Date().toISOString());

    console.log("Enviando FormData para n8n:", N8N_WEBHOOK_URL);

    // Enviar para o webhook do n8n como FormData
    const response = await axios.post(N8N_WEBHOOK_URL, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 30000, // 30 segundos
    });

    // Limpar arquivos temporários
    files.forEach((file) => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });

    res.json({
      success: true,
      message: `${files.length} arquivo(s) enviado(s) com sucesso para processamento`,
      fileIds: files.map((f) => f.filename),
      n8nResponse: response.data,
    });
  } catch (error: any) {
    console.error("Erro no upload:", error);

    // Limpar arquivos temporários em caso de erro
    const files = req.files as Express.Multer.File[];
    if (files) {
      files.forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
      error:
        process.env.NODE_ENV === "development" ? error.message : "Erro interno",
    });
  }
});

export default router;
