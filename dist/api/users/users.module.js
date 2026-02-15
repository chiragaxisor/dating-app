"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const purchase_verification_service_1 = require("./purchase-verification.service");
const users_controller_1 = require("./users.controller");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const user_interaction_entity_1 = require("./entities/user-interaction.entity");
const coin_history_entity_1 = require("./entities/coin-history.entity");
const store_purchase_entity_1 = require("./entities/store-purchase.entity");
const chat_module_1 = require("../chat/chat.module");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.Users, user_interaction_entity_1.UserInteraction, coin_history_entity_1.CoinHistory, store_purchase_entity_1.StorePurchase]),
            (0, common_1.forwardRef)(() => chat_module_1.ChatModule),
        ],
        controllers: [users_controller_1.UsersController],
        providers: [
            users_service_1.UsersService,
            purchase_verification_service_1.PurchaseVerificationService,
        ],
        exports: [users_service_1.UsersService, purchase_verification_service_1.PurchaseVerificationService],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map