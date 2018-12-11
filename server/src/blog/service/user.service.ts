import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { encryptPwd } from 'src/common/utils/util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * 判断用户是否为空
   */
  async IsEmptyUsers() {
    return (await this.userRepository.count()) === 0;
  }

  /**
   * 获取root用户
   */
  async findRoot() {
    return await this.userRepository.findOne({ group: 'admin' });
  }

  async created(dto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      name: dto.name,
      email: dto.email,
    });
    if (user) {
      throw new BadRequestException('用户已存在');
    }
    return await this.userRepository.save(
      this.userRepository.create({
        ...dto,
        password: encryptPwd(dto.password),
      }),
    );
  }

  async findOne(data: { name?: string; uid?: number }) {
    return await this.userRepository.findOne(data);
  }

  async update(id: number, date: UpdateUserDto) {
    return await this.userRepository.update(id, {
      name: date.name,
      url: date.url,
      avatar: date.avatar,
      slogan: date.slogan,
    });
  }

  async updatePwd(dto: UpdatePasswordDto) {
    const user = await this.findOne({ name: dto.name });
    if (user.password !== encryptPwd(dto.oldPassword)) {
      throw new BadRequestException('密码错误');
    }
    if (user.password === encryptPwd(dto.newPassword)) {
      throw new BadRequestException('新旧密码不能一样');
    }
    return await this.userRepository.update(
      { name: dto.name },
      { password: encryptPwd(dto.newPassword) },
    );
  }
}
