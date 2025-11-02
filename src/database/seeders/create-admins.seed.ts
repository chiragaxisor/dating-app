import { Admins } from 'src/admin/admin.entity';
import { encodePassword } from 'src/common/helper/bcrypt.helper';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateAdmins implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection.query(`SET FOREIGN_KEY_CHECKS=0;`);
    await connection.query(`TRUNCATE admins;`);
    await connection.query(`SET FOREIGN_KEY_CHECKS=1;`);

    await connection
      .createQueryBuilder()
      .insert()
      .into(Admins)
      .values([
        {
          id: 1,
          name: 'Admin',
          email: 'appemail@mail.com',
          password: encodePassword('password'),
        },
        {
          id: 2,
          name: 'Superadmin',
          email: 'admin@mail.com',
          password: encodePassword('masterpassword'),
        },
      ])
      .execute();

    console.log('Seeding completed for TABLE: admins');
  }
}
