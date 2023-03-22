import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @ApiProperty()
  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @ApiProperty()
  @DeleteDateColumn({ type: 'datetime' })
  deletedAt: Date;
}
