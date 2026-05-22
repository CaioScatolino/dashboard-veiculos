import { RequestHandler } from "express";
import * as userService from "../services/user.service";

export const getAllUsers: RequestHandler = async (req, res) => {
  const users = await userService.getAllUsers();

  if (!users) {
    return res.status(404).json({
      message: "Users not found",
      data: null,
    });
  }

  if (!users.message) {
    return res.status(400).json({
      message: users.message,
      data: users.data,
    });
  }

  return res.status(200).json({
    message: true,
    data: users.data,
  });
};

// Busca os dados do usuário atualmente logado (de forma 100% segura!)
export const getLoggedUser: RequestHandler = async (req, res) => {
  try {
    // 1. O middleware já garantiu que req.user existe e é válido
    if (!req.user) {
      return res.status(401).json({ message: "Não autenticado." });
    }
    // 2. Pegamos o telegramId seguro vindo do Cookie
    const telegramId = req.user.telegramId;
    // 3. Buscamos no serviço
    const user = await userService.getUserByTelegramId(telegramId);
    if (!user || !user.message) {
      return res.status(404).json({
        message: "Usuário não encontrado no banco de dados.",
        data: null,
      });
    }
    // 4. Retorna as informações do usuário atual
    return res.status(200).json({
      message: true,
      data: user.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro interno no servidor ao carregar perfil.",
      data: error,
    });
  }
};
