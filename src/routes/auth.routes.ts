import { Request, Response, Router } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
const router = Router();

// Interface tipando os dados que vêm na query da URL
interface TelegramAuthQuery {
  hash?: string;
  id?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date?: string;
  [key: string]: string | undefined; // Permite outras chaves genéricas de segurança
}

router.get(
  "/telegram/callback",
  async (req: Request<{}, {}, {}, TelegramAuthQuery>, res: Response) => {
    const { hash, ...telegramData } = req.query;

    if (!hash) {
      return res.status(400).json({ error: "Hash ausente" });
    }

    // O TypeScript exige que você garanta que a variável de ambiente existe
    const botToken = process.env.BOT_TOKEN;
    if (!botToken) {
      return res
        .status(500)
        .json({ error: "BOT_TOKEN não configurado no servidor." });
    }

    // 1. Validação de Segurança
    const checkString = Object.keys(telegramData)
      .sort()
      .map((key) => `${key}=${telegramData[key]}`)
      .join("\n");

    const secretKey = crypto.createHash("sha256").update(botToken).digest();
    const validHash = crypto
      .createHmac("sha256", secretKey)
      .update(checkString)
      .digest("hex");

    if (hash !== validHash) {
      return res.status(401).json({ error: "Login forjado!" });
    }

    // Montando o nome completo (O sobrenome é opcional no Telegram, então tratamos isso)
    const nomeCompleto = telegramData.last_name
      ? `${telegramData.first_name} ${telegramData.last_name}`
      : telegramData.first_name;

    // 2. Geração do JWT
    const jwtSecret = process.env.JWT_SECRET || "senha_secreta_teste";
    const token = jwt.sign({ telegramId: telegramData.id }, jwtSecret, {
      expiresIn: "24h",
    });

    // 3. Retorno dos dados formatados
    // 🌟 NOVO: Salva o JWT em um cookie seguro no navegador
    res.cookie("token", token, {
      httpOnly: true, // Impede que o Javascript do frontend leia o cookie (Proteção XSS)
      secure: process.env.NODE_ENV === "production", // Apenas envia via HTTPS em produção
      sameSite: "lax", // Proteção básica contra CSRF
      maxAge: 24 * 60 * 60 * 1000, // Expira em 24 horas (em milissegundos)
    });
    // 3. Retorno dos dados formatados (você ainda pode retornar os dados no JSON se o frontend precisar)
    return res.json({
      mensagem: "Login validado com sucesso e cookie configurado!",
      usuario: {
        telegramId: telegramData.id,
        nome: nomeCompleto,
        username: telegramData.username || "Sem username",
        foto: telegramData.photo_url || null,
        telefone: "Não fornecido via Web Widget (Restrição de Privacidade)",
      },
    });
  },
);

export default router;
