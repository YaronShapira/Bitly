// @Entity()
export class Url {
  // @PrimaryGeneratedColumn()
  id: number;

  // @Column({ unique: true })
  shortUrl: string;

  // @Column()
  originalUrl: string;

  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
