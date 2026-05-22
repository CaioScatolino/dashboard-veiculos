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

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 1. Obter o header Authorization
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  // O padrão é "Bearer <TOKEN>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2) {
    return res.status(401).json({ error: "Token mal formatado." });
  }

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: "Token sem o prefixo Bearer." });
  }

  try {
    // 2. Verificar o JWT
    const jwtSecret = process.env.JWT_SECRET || "senha_secreta_teste";
    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

    // 3. Verificar se o usuário existe e a sessão está ativa no banco
    // Nota: O telegramId no banco foi tipado como number no Drizzle (bigint)
    const userExists = await db
      .select()
      .from(users)
      .where(eq(users.telegramId, decoded.telegramId))
      .limit(1);

    if (userExists.length === 0) {
      return res
        .status(401)
        .json({ error: "Usuário não encontrado ou sessão inativa." });
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
