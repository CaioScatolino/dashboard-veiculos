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
