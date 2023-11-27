import yup from "yup";
import validator from "../../helpers/validator.mjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default {
  get: async (req, res) => {
    try {
      const users = await prisma.users.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          emailVerified: true,
          role: true,
          createdAt: true,
        }
      })

      return res.json(users)
    } catch (error) {
      console.error(error);
      return res.INTERNAL_SERVER_ERROR()
    }

    
  }
}