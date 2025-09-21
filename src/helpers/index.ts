import crypto from "crypto";
export const random = () => crypto.randomBytes(164).toString("base64");

const secret: string = "hellobossiamaviraj";
export const authenticationHMAC = (salt: string, password: string): string => {
  const data = [salt, password].join("/");
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
};
