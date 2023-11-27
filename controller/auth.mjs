import yup from "yup";
import validator from "./../helpers/validator.mjs";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const prisma= new PrismaClient();

export default {
  /**
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
   */
  login: async (req, res)=> {
    try {
      const schema = yup.object({
        email: yup.string().required(),
        password: yup.string().required()
      })

      const validate = await validator(schema, req.body)

      if (validate.errors) {
        return res.status(400).json({
          errors: validate.errors
        })
      }

      const {email, password} = req.body;

      const findAccount = await prisma.users.findFirst({
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          role: true,
        },
        where: {
          email,
        }
      });

      if (!findAccount) {
        return res.status(404).json({
          error: 'Email atau Password masih salah!'
        })
      }

      if (!await bcrypt.compare(password, findAccount.password)) {
        return res.status(403).json({
          error: 'Email atau Password masih salah!'
        })
      }

      const token = await jwt.sign({
        id: findAccount.id,
        role: findAccount.role
      }, process.env.JWT_UMKM_SECRET, {
        expiresIn: '30d',
        audience: 'client',
        issuer: 'navloe'
      })

      return res.json({
        token,
        name:findAccount.name
      })
    } catch (error) {
      console.error(`auth.login : ${error}`);
      return res.INTERNAL_SERVER_ERROR();
    }
  },
  /**
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
   */
  register: async (req, res)=> {
    try {
      const schema = yup.object({
        name: yup.string().required(),
        email: yup.string().required(),
        phoneNumber: yup.string().required(),
        password: yup.string().required(),
        nib: yup.string().required(),
        enterpriseName: yup.string().required(),
        enterpriseType: yup.string().oneOf(['product', 'service', 'both']),
        enterpriseCategories: yup.string().required(),
      });

      const validate = await validator(schema, req.body);
      
      if (validate.errors) {
        return res.status(400).json({
          errors: validate.errors,
        });
      }

      const {name, email, phoneNumber, password, nib, enterpriseName, enterpriseType, enterpriseCategories} = req.body;

      const findAccount = await prisma.users.findFirst({
        select: {
          id: true,
          name: true,
        },
        where: {
          email,
        }
      });

      if (findAccount) {
        return res.status(403).json({
          error: 'Email sudah digunakan!',
        });
      }

      const findEnterpriseByNIB = await prisma.enterprises.findFirst({
        select: {
          id: true,
          nib: true,
          name: true,
          status: true,
        },
        where: {
          nib,
        }
      })

      if (findEnterpriseByNIB) {
        return res.status(403).json({
          error: `NIB sudah teregistrasi dengan status ${findEnterpriseByNIB.status}!`,
        });
      }

      const passwordHashed = await bcrypt.hash(password, 10);
      
      const createdUser = await prisma.users.create({
        data: {
          name,
          email,
          password: passwordHashed,
          phoneNumber,
        }
      });

      const alphabet = "abcdefghjkmnpqrstwxyz"
      const randomString = "" + alphabet[Math.floor(Math.random() * 21)] + Math.floor(Math.random() * 21) + Math.floor(Math.random() * 21)
      const enterpriseUID = enterpriseName.toLowerCase().replaceAll(" ", "-") + randomString

      await prisma.enterprises.create({
        data: {
          nib,
          userId: createdUser.id,
          name: enterpriseName,
          uid: enterpriseUID,
          type: enterpriseType,
          categories: enterpriseCategories,
        }
      })
      
      return res.send('Registration successful');
    } catch (error) {
      console.error(`auth.register : ${error}`);

      return res.INTERNAL_SERVER_ERROR();
    }
  },
}