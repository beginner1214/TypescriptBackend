import { Express, Request, Response } from "express";
import { getUserByEmail } from "../db/schema/user";
import { authenticationHMAC, random } from "../helpers/index";
import { createuser } from "../db/schema/user";

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = random();
    const user = await createuser({
      email,
      username,
      authentication: {
        salt,
        password: authenticationHMAC(salt, password),
      },
    });
    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Internal server error" });
  }
};
