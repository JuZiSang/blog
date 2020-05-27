import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/entitys/user.entity";
import { Repository } from "typeorm";
import { UserDto } from "./user.dto";
import { MD5 } from 'crypto-js'

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>
  ) { }

  findOne({ id, username }: { id?: number, username?: string }) {
    return username
      ? this.userEntity.findOne({ username })
      : this.userEntity.findOne({ id })
  }

  async validate(userDto: UserDto) {
    const user = await this.userEntity.findOne({ username: userDto.username })
    if (!user) {
      return false
    }
    if (user.password === user.password) {
      return true
    }
    return false
  }

  async create(userDto: UserDto) {
    await this.userEntity.save({
      ...userDto,
      password: MD5(userDto.password).toString()
    })
  }
}