import { Router } from "express"
import auth from "./controller/auth.mjs";
import umkmMiddleware from "./middleware/umkm.middleware.mjs";
import adminMiddleware from "./middleware/admin.middleware.mjs";
import users from "./controller/admin/users.mjs";
import categories from "./controller/admin/categories.mjs";
import adminEnterprises from "./controller/admin/enterprises.mjs";
import userEnterprises from "./controller/user/enterprises.mjs";
import catalogs from "./controller/user/catalogs.mjs";
import report from "./controller/Report.mjs";
// import landingPage from "./controller/landingPage.mjs";


const router = Router()

// PUBLIC AREA
router.post('/report', report.createReport);

router.post('/auth/login', auth.login);
router.post('/auth/register', auth.register);
router.get('/auth/whoami', auth.whoami);

// USER AREA
router.get('/user/enterprise', umkmMiddleware, userEnterprises.getEnterprise);
router.put('/user/enterprise', umkmMiddleware, userEnterprises.updateEnterprise);

router.get('/user/catalogs', catalogs.getCatalogs);
router.get('/user/catalog/:id', catalogs.getDetailCatalog);
router.post('/user/catalog', catalogs.createCatalog);
router.put('/user/catalog/:id', catalogs.updateCatalog);
router.delete('/user/catalog/:id', catalogs.deleteCatalog);

// router.get('/', landingPage.getLandingPage);

// ADMIN AREA
router.get('/admin/users', adminMiddleware, users.get);
router.get('/admin/user/:id', adminMiddleware, users.detailUser);
router.put('/admin/user/:id', adminMiddleware, users.updateUser);
router.delete('/admin/user/:id', adminMiddleware, users.deleteUser);

router.get('/admin/categories', adminMiddleware, categories.get);
router.get('/admin/category/:id', adminMiddleware, categories.detail);
router.post('/admin/category', adminMiddleware, categories.create);
router.put('/admin/category/:id', adminMiddleware, categories.update);
router.delete('/admin/category/:id', adminMiddleware, categories.delete);

router.get('/admin/enterprises', adminMiddleware, adminEnterprises.getEnterprises);
router.get('/admin/enterprise/:id', adminMiddleware, adminEnterprises.getDetailEnterprise);
router.put('/admin/enterprise/:id', adminMiddleware, adminEnterprises.updateEnterprise);
router.delete('/admin/enterprise/:id', adminMiddleware, adminEnterprises.deleteEnterprise);

router.get('/admin/report', adminMiddleware, report.adminGetReport);
router.put('/admin/report/:id', adminMiddleware, report.adminEditReport);
router.post('/admin/reportType', adminMiddleware, report.createReportType);

export default router;