import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'

@Injectable()
export class TestDbService {
  constructor(private readonly dataSource: DataSource) {}

  async checkTables() {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    
    // ดึงรายชื่อตารางทั้งหมด
    const tables = await queryRunner.getTables()
    await queryRunner.release()
    
    return tables.map((table) => table.name)
  }
}
