import { Router } from "express"
import multer from "multer";

import umkmMiddleware from "./middleware/umkm.middleware.mjs";
import adminMiddleware from "./middleware/admin.middleware.mjs";

import auth from "./controller/auth.mjs";
import report from "./controller/report.mjs";
import landingPage from "./controller/landingPage.mjs";
import publicCategories from "./controller/categories.mjs";

import userEnterprises from "./controller/user/enterprises.mjs";
import catalogs from "./controller/user/catalogs.mjs";

import users from "./controller/admin/users.mjs";
import adminCategories from "./controller/admin/categories.mjs";
import adminEnterprises from "./controller/admin/enterprises.mjs";
import settings from "./controller/admin/settings.mjs";


const router = Router()
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// PUBLIC AREA
router.post('/report', report.createReport);

router.post('/auth/login', auth.login);
router.post('/auth/register', auth.register);
router.get('/auth/whoami', auth.whoami);

router.get('/categories', publicCategories.get);

// USER AREA
router.get('/user/enterprise', umkmMiddleware, userEnterprises.getEnterprise);
router.put('/user/enterprise', upload.single('logoUrl'), umkmMiddleware, userEnterprises.updateEnterprise);

router.get('/user/catalogs', umkmMiddleware,  catalogs.getCatalogs);
router.get('/user/catalog/:id', umkmMiddleware, catalogs.getDetailCatalog);
router.post('/user/catalog', umkmMiddleware, upload.any(), catalogs.createCatalog);
router.put('/user/catalog/:id', umkmMiddleware, upload.any(), catalogs.updateCatalog);
router.delete('/user/catalog/:id', umkmMiddleware, catalogs.deleteCatalog);

// router.get('/', landingPage.getLandingPage);

// ADMIN AREA
router.get('/admin/users', adminMiddleware, users.get);
router.get('/admin/user/:id', adminMiddleware, users.detailUser);
router.put('/admin/user/:id', adminMiddleware, users.updateUser);
router.delete('/admin/user/:id', adminMiddleware, users.deleteUser);

router.get('/admin/categories', adminMiddleware, adminCategories.get);
router.get('/admin/category/:id', adminMiddleware, adminCategories.detail);
router.post('/admin/category', upload.single('imageUrl'), adminMiddleware, adminCategories.create);
router.put('/admin/category/:id', adminMiddleware, adminCategories.update);
router.delete('/admin/category/:id', adminMiddleware, adminCategories.delete);

router.get('/admin/enterprises', adminMiddleware, adminEnterprises.getEnterprises);
router.get('/admin/enterprise/:id', adminMiddleware, adminEnterprises.getDetailEnterprise);
router.put('/admin/enterprise/:id', adminMiddleware, adminEnterprises.updateEnterprise);
router.delete('/admin/enterprise/:id', adminMiddleware, adminEnterprises.deleteEnterprise);

router.get('/admin/report', adminMiddleware, report.adminGetReport);
router.put('/admin/report/:id', adminMiddleware, report.adminEditReport);
router.post('/admin/reportType', adminMiddleware, report.createReportType);

router.get('/admin/settings', settings.getSettings);
router.get('/admin/setting/:id', settings.getDetailSetting);
router.post('/admin/setting', settings.postSetting);
router.put('/admin/setting/:id', settings.editSetting);
router.delete('/admin/setting/:id', settings.deleteSetting);

export default router;