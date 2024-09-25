import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrders1727261998316 implements MigrationInterface {
  name = 'AddOrders1727261998316';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`orders\` (
        \`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
        \`number\` varchar(10) NOT NULL,
        \`fullName\` varchar(128) NOT NULL,
        \`email\` varchar(64) NOT NULL,
        \`address\` text NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        UNIQUE INDEX \`IDX_4e174e347d448617acdf98fef0\` (\`number\`),
        UNIQUE INDEX \`IDX_290bc8842ff16ea3be0f1a74c3\` (\`email\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_290bc8842ff16ea3be0f1a74c3\` ON \`orders\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_4e174e347d448617acdf98fef0\` ON \`orders\``,
    );
    await queryRunner.query(`DROP TABLE \`orders\``);
  }
}
