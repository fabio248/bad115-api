import { Controller } from '@nestjs/common';
import { AdminsService } from '../services/admins.service';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}
}
