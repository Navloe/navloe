import { Router } from "express"
import auth from "./controller/auth.mjs";
import umkmMiddleware from "./middleware/umkm.middleware.mjs";
import adminMiddleware from "./middleware/admin.middleware.mjs";
import users from "./controller/admin/users.mjs";
import categories from "./controller/admin/categories.mjs";
import enterprises from "./controller/admin/enterprises.mjs";
import catalogs from "./controller/user/catalogs.mjs";
import report from "./controller/Report.mjs";
import landingPage from "./controller/landingPage.mjs";


const router = Router()

router.get('/', landingPage.getLandingPage);

router.post('/auth/login', auth.login);
router.post('/auth/register', auth.register);
router.get('/auth/whoami', auth.whoami);

router.get('/admin/users', adminMiddleware, users.get);
router.get('/admin/user/:id', users.detailUser);
router.put('/admin/user/:id', users.updateUser);
router.delete('/admin/user/:id', users.deleteUser);


router.get('/admin/categories', categories.get);
router.get('/admin/category/:id', categories.detail);
router.post('/admin/category', categories.create);
router.put('/admin/category/:id', categories.update);
router.delete('/admin/category/:id', categories.delete);


router.get('/admin/enterprises', enterprises.getEnterprises);
router.get('/admin/enterprise/:id', enterprises.getDetailEnterprise);
router.put('/admin/enterprise/:id', enterprises.updateEnterprise);
router.delete('/admin/enterprise/:id', enterprises.deleteEnterprise);


router.post('/reportType', report.createReportType),
router.post('/report', report.createReport);

router.get('/admin/report', report.adminGetReport);
router.put('/admin/report/:id', report.adminEditReport);


router.get('/dashboard/catalogs', catalogs.getCatalogs);
router.get('/dashboard/catalog/:id', catalogs.getDetailCatalog);
router.post('/dashboard/catalog', catalogs.createCatalog);
router.put('/dashboard/catalog/:id', catalogs.updateCatalog);
router.delete('/dashboard/catalog/:id', catalogs.deleteCatalog);


router.get('/admin/settings', settings.getSettings);
router.get('/admin/setting/:id', settings.getDetailSetting);

export default router;