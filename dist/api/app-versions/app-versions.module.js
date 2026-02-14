"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppVersionsModule = void 0;
const common_1 = require("@nestjs/common");
const app_versions_service_1 = require("./app-versions.service");
const app_versions_controller_1 = require("./app-versions.controller");
const typeorm_1 = require("@nestjs/typeorm");
const app_versions_entity_1 = require("./entities/app-versions.entity");
let AppVersionsModule = class AppVersionsModule {
};
exports.AppVersionsModule = AppVersionsModule;
exports.AppVersionsModule = AppVersionsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([app_versions_entity_1.AppVersions])],
        controllers: [app_versions_controller_1.AppVersionsController],
        providers: [
            app_versions_service_1.AppVersionsService,
        ],
    })
], AppVersionsModule);
//# sourceMappingURL=app-versions.module.js.map