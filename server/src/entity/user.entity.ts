import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from './base.entity'

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ comment: 'id' })
  id: number

  @Column({ comment: '账号', unique: true })
  username: string

  @Column({ comment: '密码', select: false, nullable: true })
  password: string

  @Column({ comment: '用户类型', type: 'enum', enum: ['master', 'follower'], default: 'follower' })
  type: 'master' | 'follower'

  @Column({ comment: '头像', nullable: true })
  avatar: string

  @Column({ comment: '签名', nullable: true })
  slogan: string

  @Column({ comment: '网站地址', nullable: true })
  url: string

  @Column({ comment: '邮箱', nullable: true })
  mail: string
}
