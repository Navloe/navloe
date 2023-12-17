import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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
      const searchKeyword = req.query.searchKeyword ?? "";

      const allCategories = await prisma.categories.findMany({
        select: {
          id: true,
          name: true,
          imageUrl: true,
          type: true,
        },
        where: {
          name: {contains: searchKeyword ?? ""}
        }
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
        where: {
          name: {contains: searchKeyword}
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
  
}