import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default{
  /**
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
  */
  getCatalogs: async (req,res) => {
    try{
      const page = parseInt(req.query.page ?? 1 )
      const limitPerPage = parseInt(req.query.limit ?? 10 )
      const searchKeyword = req.query.searchKeyword ?? null

      const catalogStatistic = await prisma.catalogs.groupBy({
        by: ['status'],
        _count: {
          status: true,
          _all: true, // This includes the counts for all statuses, even those with a count of 0
        },
      })

      const allCatalogs = await prisma.catalogs.findMany({
        where: {
          AND:[
            { status: 'show' },
          ],
          OR: [
            { name: {contains: searchKeyword ?? ""} },
            { description: {contains: searchKeyword ?? ""} },
            { keywords: {contains: searchKeyword ?? ""} },
          ]
        },
        include: {
          enterprise: true
        }
      })

      const totalPage = Math.ceil(allCatalogs.length / limitPerPage);

      if (allCatalogs.length > 0 && page > totalPage) {
        return res.status(404).json({ 
          message: "Page numbering out of bounds" 
        })
      }

      const paginatedCatalogs = await prisma.catalogs.findMany({
        where: {
          AND:[
            { status: 'show' },
          ],
          OR: [
            { name: {contains: searchKeyword ?? ""} },
            { description: {contains: searchKeyword ?? ""} },
            { keywords: {contains: searchKeyword ?? ""} },
          ]
        },
        include: {
          enterprise: true
        },
        skip: limitPerPage * (page - 1),
        take: limitPerPage,
      })

      return res.json({
        data: paginatedCatalogs,
        pagination: {
          currentPage: page,
          limitPerPage,
          totalPage,
          displayedData: paginatedCatalogs.length,
          totalData: allCatalogs.length,
        },
        catalogStatistic
      })

    }catch(error){
      console.log(error);
      return res.INTERNAL_SERVER_ERROR()
    }

  },
}