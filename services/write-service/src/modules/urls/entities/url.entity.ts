// @Entity()
export class Url {
  // @PrimaryGeneratedColumn()
  id?: string;

  // @Column({ unique: true })
  shortUrl: string;

  // @Column()
  originalUrl: string;

  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
