import { MigrationInterface, QueryRunner } from 'typeorm';

export class categories1679556497057 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "INSERT INTO `freemerchandise`.`category` (`name`, `slug`) VALUES ('Furniture', 'furniture'), ('Home Appliance', 'home-appliance'), ('Bicycle', 'bicycle'), ('Kitchen', 'kitchen'), ('Instrument', 'instrument'), ('Computer', 'computer'), ('Book/CD/DVD', 'book-cd-dvd');",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query('');
  }
}
