import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from '../users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';
@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  /* #10-02 */
  createEstimate({ make, model, lng, lat, year, mileage }: GetEstimateDto) {
    return (
      this.repo
        .createQueryBuilder()
        .select('AVG(price)', 'price')
        .where('make = :make', { make })
        .andWhere('model = :model', { model })
        .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
        .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
        .andWhere('year - :year BETWEEN -3 AND 3', { year })
        .andWhere('approved IS TRUE')
        /* 
          - order by the mileage with the ones
            close to the mileage criterion on top   
        */
        .orderBy('ABS(mileage - :mileage)', 'DESC')
        /*
          - you specify the "order by" parameter
            using a separate setParameters
            method   
        */
        .setParameters({ mileage })
        .limit(3)
        .getRawOne()
    );
  }

  create(reportDto: CreateReportDto, user: User) {
    /* #08-06
      - create an report instance
      - assign the user to the user property 
        on the report even though we only 
        store the user id in the db to
        associate a report wit an user
      - call the save method on the repo
    */

    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne(id);
    if (!report) {
      throw new NotFoundException('report not found');
    }
    report.approved = approved;
    return this.repo.save(report);
  }
}
