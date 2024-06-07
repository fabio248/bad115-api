import { PartialType } from '@nestjs/swagger';
import { CreateMeetingAplicationDto } from './create-meeting.dto';

export class UpdateMeetingDto extends PartialType(CreateMeetingAplicationDto) {}
