import yup from "yup";
import { PrismaClient } from "@prisma/client";
import validator from "../../helpers/validator.mjs";
// import { CategoriesType } from "@prisma/client";
const prisma = new PrismaClient();

export default {
    get: async (req, res) => {
        try {
            const categories = await prisma.categories.findMany({
                select: {
                    id : true,
                    name : true,
                    imageUrl : true,
                    type : true
                }
            })
            return res.json(categories);
        
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
    post: async (req, res) => {
        try{
            console.log(req.body);
            const schema = yup.object({
                name: yup.string().required(),
                imageUrl: yup.string().required(),
                type: yup.string().oneOf(['product', 'service'])
            });

            const validate = await validator(schema, req.body);


            if (validate.errors) {
                return res.status(400).json({
                  errors: validate.errors,
                });
            }
        
            const {name, imageUrl, type} = req.body;
            
            
            const createdCategories = await prisma.categories.create({
                data: {
                    name : name,
                    imageUrl : imageUrl,
                    type : type
                }
              })

            return res.send('Post Categories successful');
        
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

    getById: async (req, res) => {
        const categoryId = parseInt(req.params.id);
        console.log(request.params);
      
        try {
            console.log(req.body);
            const getCategory = await prisma.category.findUnique({
                where: {
                    id: categoryId,
                },
            });
      
          if (!getCategory) {
            return res.status(404).json({ message: 'Kategori tidak ditemukan' });
          }
      
            return res.status(200).json({ getCategory });
        } catch (error) {
            return res.status(500).json({ message: 'Terjadi kesalahan dalam mendapatkan id kategori', error: error.message });
        }
    },
    /**
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
   */

    put: async(req, res) => {
        const categoryId = parseInt(req.params.id);
        const {name, imageUrl, type} = req.body;

        try {
            console.log(req.body);
            const existingCategory = await prisma.category.findUnique({
                where: {
                    id: categoryId,
                },
            });

            if (!existingCategory) {
                return res.status(404).json({ message: 'Kategori tidak ditemukan' });
            }

            const updatedCategory = await prisma.category.update({
                where: {
                    id: categoryId,
                },
                data: {
                    name: name || existingCategory.name,
                    imageUrl: imageUrl || existingCategory.imageUrl,
                    type: type || existingCategory.type,
                },
            });

            return res.status(200).json({ message: 'Kategori berhasil diubah', category: updatedCategory });
        } catch (error) {
            return res.status(500).json({ message: 'Terjadi kesalahan dalam mengubah kategori', error: error.message });
        }
    }
    
}

module.exports = {
    get,
    post,
    getById,
    put
}