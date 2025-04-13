"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var validateRequest_middleware_js_1 = require("../middlewares/validateRequest.middleware.js");
var userRouter = express_1.default.Router();
userRouter.post("/", validateRequest_middleware_js_1.validateRequest);
exports.default = userRouter;
