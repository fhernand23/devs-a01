import { emailPattern } from "./constants";

export const validateEmail = (email: string) => {
    if (!email) {
      return "Email is required";
    }

    if (!emailPattern.test(email)) {
      return "Invalid email address";
    }

    return "";
  };