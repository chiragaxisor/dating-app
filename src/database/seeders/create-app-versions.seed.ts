import { AppVersions } from 'src/api/app-versions/entities/app-versions.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { DeviceTypes } from 'src/common/constants';

export default class CreateAppVersions implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection.query(`SET FOREIGN_KEY_CHECKS=0;`);
    await connection.query(`TRUNCATE app_versions;`);
    await connection.query(`SET FOREIGN_KEY_CHECKS=1;`);

    await connection
      .createQueryBuilder()
      .insert()
      .into(AppVersions)
      .values([
        {
          minVersion: 1,
          latestVersion: 1,
          link: 'https://ios.apple.com/join/h86sugHG',
          platform: DeviceTypes.IOS,
        },
        {
          minVersion: 1,
          latestVersion: 1,
          link: 'https://play.google.com/store/apps/details?id=com.app.mobile.app&pcampaignid=web_share',
          platform: DeviceTypes.ANDROID,
        },
      ])
      .execute();

    console.log('Seeding completed for TABLE: app_versions');
  }
}
