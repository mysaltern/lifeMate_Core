import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImportanceLevels implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert the default importance levels
    await queryRunner.query(`
      INSERT INTO importance_level (name)
      VALUES ('low'), ('medium'), ('high')
      ON CONFLICT (name) DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Rollback the inserted rows
    await queryRunner.query(`
      DELETE FROM importance_level WHERE name IN ('low', 'medium', 'high');
    `);
  }
}
