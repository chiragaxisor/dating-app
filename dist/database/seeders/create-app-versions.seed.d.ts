import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
export default class CreateAppVersions implements Seeder {
    run(factory: Factory, connection: Connection): Promise<any>;
}
