import { Router } from "express"
import auth from "./controller/auth.mjs";
import umkmMiddleware from "./middleware/umkm.middleware.mjs";
import adminMiddleware from "./middleware/admin.middleware.mjs";
import users from "./controller/admin/users.mjs";
import categories from "./controller/admin/categories.mjs";
import enterprises from "./controller/admin/enterprises.mjs";
import catalogs from "./controller/user/catalogs.mjs";

const router = Router()

router.post('/auth/login', auth.login);
router.post('/auth/register', auth.register);

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


router.get('/user/catalogs', catalogs.getCatalogs);
router.get('/user/catalog/:id', catalogs.getDetailCatalog);
router.post('/user/catalog', catalogs.createCatalog);
router.put('/user/catalog/:id', catalogs.updateCatalog);
router.delete('/user/catalog/:id', catalogs.deleteCatalog);


export default router;