import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TagEntity } from "@app/modules/blog/entity/tag.entity";
import { Repository } from "typeorm";
import { TagDto } from "../dto/tag.dto";

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagEntity: Repository<TagEntity>
  ) { }

  list() {
    return this.tagEntity.find()
  }

  async get(name: string) {
    const tag = await this.tagEntity.findOne({ name })
    if (!tag) {
      throw new NotFoundException(`${name}不存在`)
    }
    return tag
  }

  pick(names: string[]) {
    return this.tagEntity.find({
      where: names.map((name) => ({ name }))
    })
  }

  async save(dto: TagDto) {
    if (await this.tagEntity.findOne({ name: dto.name })) {
      throw new BadRequestException(`${dto.name}标签已存在`)
    }
    const entity = this.tagEntity.create(dto)
    return await this.tagEntity.save(entity)
  }

  async update(id: number, dto: TagDto) {
    if (!(await this.tagEntity.findOne({ id }))) {
      throw new NotFoundException(`${dto.name}不存在`)
    }
    const entity = this.tagEntity.create(dto)
    await this.tagEntity.update(id, entity)
    return await this.tagEntity.findOne({ id })
  }
}