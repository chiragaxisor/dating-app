"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_versions_entity_1 = require("../../api/app-versions/entities/app-versions.entity");
const constants_1 = require("../../common/constants");
class CreateAppVersions {
    async run(factory, connection) {
        await connection.query(`SET FOREIGN_KEY_CHECKS=0;`);
        await connection.query(`TRUNCATE app_versions;`);
        await connection.query(`SET FOREIGN_KEY_CHECKS=1;`);
        await connection
            .createQueryBuilder()
            .insert()
            .into(app_versions_entity_1.AppVersions)
            .values([
            {
                minVersion: 1,
                latestVersion: 1,
                link: 'https://ios.apple.com/join/h86sugHG',
                platform: constants_1.DeviceTypes.IOS,
            },
            {
                minVersion: 1,
                latestVersion: 1,
                link: 'https://play.google.com/store/apps/details?id=com.app.mobile.app&pcampaignid=web_share',
                platform: constants_1.DeviceTypes.ANDROID,
            },
        ])
            .execute();
        console.log('Seeding completed for TABLE: app_versions');
    }
}
exports.default = CreateAppVersions;
//# sourceMappingURL=create-app-versions.seed.js.map