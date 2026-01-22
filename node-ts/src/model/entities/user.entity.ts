import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  registrationAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  referralBonus: number;

  @Column({ nullable: true })
  referrerId: number;

  // Binary tree - left and right placement
  @Column({ nullable: true })
  leftPlacementId: number;

  @Column({ nullable: true })
  rightPlacementId: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'leftPlacementId' })
  leftPlacement: User;

  @OneToOne(() => User)
  @JoinColumn({ name: 'rightPlacementId' })
  rightPlacement: User;

  @ManyToOne(() => User, (user) => user.referrals, { nullable: true })
  @JoinColumn({ name: 'referrerId' })
  referrer: User;

  @OneToMany(() => User, (user) => user.referrer)
  referrals: User[];

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
