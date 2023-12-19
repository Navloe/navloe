import yup from "yup";
import { PrismaClient } from "@prisma/client";
import validator from "../../helpers/validator.mjs";
import cloudinary from '../../config/cloudinaryConfig.mjs';
// import { CategoriesType } from "@prisma/client";
const prisma = new PrismaClient();

// import fileUpload from 'express-fileupload';

// app.use(fileUpload({ useTempFiles: true }));

// import multer from 'multer';
// const upload = multer({ dest: 'uploads/' });

export default {
  
  /**
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
  */
  get: async (req, res) => {
    try {
      const page = parseInt(req.query.page ?? 1 );
      const limitPerPage = parseInt(req.query.limit ?? 10 );

      const allCategories = await prisma.categories.findMany({
        select: {
          id: true,
          name: true,
          imageUrl: true,
          type: true,
        },
      })

      const totalPage = Math.ceil(allCategories.length / limitPerPage);

      if (page > totalPage) {
        return res.status(404).json({ 
          message: "Page numbering out of bounds" 
        })
      }

      const paginatedCategory = await prisma.categories.findMany({
        select: {
          id: true,
          name: true,
          imageUrl: true,
          type: true,
        },
        skip: limitPerPage * (page - 1),
        take: limitPerPage,
      })

      return res.json({
        data: paginatedCategory,
        pagination: {
          currentPage: page,
          limitPerPage,
          totalPage,
          displayedData: paginatedCategory.length,
          totalData: allCategories.length,
        }
      });
    
    }catch (error) {
      console.error(error);
      return res.INTERNAL_SERVER_ERROR()
    }

  },

  /**
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
   */
  detail: async (req, res) => {
    const { id } = req.params

    try {
      const category = await prisma.categories.findFirst({
        where: { id },
      });
    
      if (!category) {
        return res.status(404).json({ 
          message: 'Category not found' 
        });
      }
    
      return res.status(200).json(
        category
      );
    } catch (error) {
      return res.INTERNAL_SERVER_ERROR()
    }
  },

  /**
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
  */
  create: async (req, res) => {

    try{
      const schema = yup.object({
        name: yup.string().required(),
        type: yup.string().required().oneOf(['product', 'service'])
      });

      const validate = await validator(schema, req.body);

      if (validate.errors) {
        return res.status(400).json({
          errors: validate.errors,
        });
      }
    
      const { name, type } = req.body;
      const base64String = req.file.buffer.toString('base64');
      const result = await cloudinary.uploader.upload(`data:image/png;base64,${base64String}`, {
        folder: "categories",
        public_id: req.file.filename
      });
      const imageUrl = result.secure_url;

      await prisma.categories.create({
        data: {
          name,
          imageUrl,
          type
        }
      })
      

      return res.status(200).json({
        message: "Category created successful"
      });
    
    }catch (error) {
      console.error(error);
      return res.INTERNAL_SERVER_ERROR()
    }
  },
  
  /**
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
   */
  update: async(req, res) => {
    const { name, imageUrl, type } = req.body;
    const { id } = req.params

    try {
      const schema = yup.object({
        name: yup.string().required(),
        imageUrl: yup.string().required(),
        type: yup.string().required().oneOf(['product', 'service'])
      });

      const validate = await validator(schema, req.body);

      if (validate.errors) {
        return res.status(400).json({
          errors: validate.errors,
        });
      }

      const oldCategory = await prisma.categories.findFirst({
        where: { id },
      });

      if (!oldCategory) {
        return res.status(404).json({ 
          message: 'Category not found' 
        });
      }

      const updatedCategory = await prisma.categories.update({
        where: { id },
        data: {
          name: name || oldCategory.name,
          imageUrl: imageUrl || oldCategory.imageUrl,
          type: type || oldCategory.type,
        },
      });

      return res.status(200).json({ 
        message: 'Category have been updated'
      });
    } catch (error) {
      return res.INTERNAL_SERVER_ERROR()
    }
  },

  delete: async (req, res) => {
    const { id } = req.params

    try {
      const existCategory = await prisma.categories.findFirst({
        where: { id },
      });
  
      if (!existCategory) {
        return res.status(404).json({ 
          message: 'Category not found' 
        });
      }
  
      await prisma.categories.delete({
        where: { id }
      })      

      return res.status(200).json({ 
        message: 'Category has been deleted' 
      })
    } catch (error) {
      return res.INTERNAL_SERVER_ERROR()
    }

  },
  
}