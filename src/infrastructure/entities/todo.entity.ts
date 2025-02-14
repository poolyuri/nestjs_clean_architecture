import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('todo')
export class TodoEntity {
  @PrimaryGeneratedColumn()
  @Index({ unique: true })
  id: number;

  @Column('varchar')
  name: string;

  @Column('boolean')
  isDone: boolean;
}
