"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const order_controller_1 = require("./order.controller");
const order_validation_1 = require("./order.validation");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(client_1.UserRole.customer, client_1.UserRole.admin), order_controller_1.OrderController.getAllOrder);
router.get('/:id', (0, auth_1.default)(client_1.UserRole.customer, client_1.UserRole.admin), order_controller_1.OrderController.getSingleOrder);
router.post('/create-order', (0, auth_1.default)(client_1.UserRole.customer), (0, validateRequest_1.default)(order_validation_1.OrderValidation.createValidation), order_controller_1.OrderController.createOrder);
router.patch('/:id', (0, validateRequest_1.default)(order_validation_1.OrderValidation.updateValidation), order_controller_1.OrderController.updateOrder);
router.delete('/:id', order_controller_1.OrderController.deleteOrder);
exports.OrderRoutes = router;
