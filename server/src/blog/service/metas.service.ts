import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MetasEntity } from '../entity/metas.entity';
import { Repository } from 'typeorm';
import { MetasDto } from '../dto/metas.dto';
import { RelationshipsEntity } from '../entity/relationships.entity';

@Injectable()
export class MetasService {
  constructor(
    @InjectRepository(MetasEntity)
    private readonly metasEntity: Repository<MetasEntity>,
  ) {}

  findOne(type: 'tag' | 'category', data: { name?: string; mid?: number }) {
    return this.metasEntity.findOne({ type, ...data });
  }

  async findAll(type: 'tag' | 'category') {
    const metas = await this.metasEntity
      .createQueryBuilder('metas')
      .select([
        'metas.mid as mid',
        'metas.name as name',
        'metas.slug as slug',
        'metas.description as description',
        'metas.type as type',
      ])
      .addSelect('COUNT(relationships.aid)', 'articleNum')
      .addFrom(RelationshipsEntity, 'relationships')
      .where('metas.mid = relationships.mid')
      .andWhere('metas.type = :type', { type })
      .groupBy('relationships.mid')
      .orderBy('articleNum', 'DESC')
      .getRawMany();
    return metas.map((item: any) => {
      item.articleNum = parseInt(item.articleNum, 0);
      return item;
    });
  }

  async create(type: 'tag' | 'category', dto: MetasDto) {
    const meta = await this.findOne(type, { name: dto.name });
    if (meta) {
      throw new BadRequestException(`${type} 已经存在`);
    }
    return await this.metasEntity.save(
      this.metasEntity.create({ ...dto, type }),
    );
  }

  async update(type: 'tag' | 'category', dto: MetasDto) {
    const meta = await this.findOne(type, { name: dto.name });
    if (!meta) {
      throw new BadRequestException(`${type} 不存在`);
    }
    return await this.metasEntity.update(meta, dto);
  }

  async delete(type: 'tag' | 'category', mid: number) {
    const meta = await this.findOne(type, { mid });
    if (!meta) {
      throw new BadRequestException(`${type} 不存在`);
    }
    return this.metasEntity.delete(mid);
  }
}
