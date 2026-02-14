"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin_entity_1 = require("../../admin/admin.entity");
const bcrypt_helper_1 = require("../../common/helper/bcrypt.helper");
class CreateAdmins {
    async run(factory, connection) {
        await connection.query(`SET FOREIGN_KEY_CHECKS=0;`);
        await connection.query(`TRUNCATE admins;`);
        await connection.query(`SET FOREIGN_KEY_CHECKS=1;`);
        await connection
            .createQueryBuilder()
            .insert()
            .into(admin_entity_1.Admins)
            .values([
            {
                id: 1,
                name: 'Admin',
                email: 'appemail@mail.com',
                password: (0, bcrypt_helper_1.encodePassword)('password'),
            },
            {
                id: 2,
                name: 'Superadmin',
                email: 'admin@mail.com',
                password: (0, bcrypt_helper_1.encodePassword)('masterpassword'),
            },
        ])
            .execute();
        console.log('Seeding completed for TABLE: admins');
    }
}
exports.default = CreateAdmins;
//# sourceMappingURL=create-admins.seed.js.map