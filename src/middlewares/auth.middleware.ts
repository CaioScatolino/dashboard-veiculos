import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db/connection.js";
import { users } from "../db/schema/index.js";
import { eq } from "drizzle-orm";

// Definimos o que está dentro do Payload do JWT
interface JWTPayload {
  telegramId: number;
  iat: number;
  exp: number;
}

// 🌟 Utilitário de alta performance para ler o cookie sem pacotes de terceiros
const getCookie = (
  cookieHeader: string | undefined,
  name: string,
): string | null => {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp("(^|;\\s*)" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[2]) : null;
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 1. Tenta obter o token do Cookie do navegador
  let token = getCookie(req.headers.cookie, "token");

  // Fallback: Se não estiver no cookie (ex: Postman/Insomnia), busca no header Authorization
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      token = parts[1];
    }
  }

  // Se não encontrar o token em nenhum dos dois lados, barra o acesso
  if (!token) {
    return res
      .status(401)
      .json({ error: "Acesso negado. Token não fornecido." });
  }

  try {
    // 2. Verificar o JWT
    const jwtSecret = process.env.JWT_SECRET || "senha_secreta_teste";
    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

    // 3. Verificar se o usuário existe e a sessão está ativa no banco
    const userExists = await db
      .select()
      .from(users)
      .where(eq(users.telegramId, decoded.telegramId))
      .limit(1);

    if (userExists.length === 0) {
      return res
        .status(401)
        .json({ error: "Usuário não encontrado ou sessão inativa no banco." });
    }

    const loggedUser = userExists[0];

    // 4. Injetar o usuário dentro do objeto Request
    req.user = {
      id: loggedUser.id,
      telegramId: loggedUser.telegramId,
      username: loggedUser.username || undefined,
      context: loggedUser.context || "main",
    };

    // Prosseguir para a próxima função/controller
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
};
