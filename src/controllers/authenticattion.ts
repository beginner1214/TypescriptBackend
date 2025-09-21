import { Request, Response } from "express";
import { getUserByEmail } from "../db/schema/user";
import { authenticationHMAC, random } from "../helpers/index";
import { createuser } from "../db/schema/user";


export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await getUserByEmail(email).select(
      "+authentication.password +authentication.salt"
    );
    if (!user || !user.authentication?.salt || !user.authentication?.password) {
      return res.sendStatus(401);
    }

    const expectedHash = authenticationHMAC(user.authentication.salt, password);
    if (user.authentication.password !== expectedHash) {
      return res.sendStatus(401);
    }
    const salt = random();
    user.authentication.sessionToken = authenticationHMAC(
      salt,
      user._id.toString()
    );
    await user.save();
    res.cookie("avirajauth", user.authentication.sessionToken, {
      domain: "locaalHost",
      path: "/",
    });
    res.status(200).json(user).end();
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};




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

