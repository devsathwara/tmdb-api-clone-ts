import * as z from "zod";

export const signInValidation: any = z.object({
  email: z.string().email({
    message: "Please enter valid email.",
  }),
  password: z.string().refine(
    (password) => {
      return (
        password.length >= 8 &&
        /[a-z]/.test(password) &&
        /[A-Z]/.test(password) &&
        /\d/.test(password) &&
        /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password)
      );
    },
    {
      message:
        "Invalid password. It should be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character.",
    }
  ),
});
export default signInValidation;
