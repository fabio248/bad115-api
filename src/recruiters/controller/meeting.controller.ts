import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MeetingService } from '../services/meeting.service';
import { JobAplicationIdDto } from 'src/job-aplication/dto/request/create-job-aplication-id.dto';
import { CreateMeetingAplicationDto } from '../dtos/request/create-meeting.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MeetingDto } from '../dtos/response/meeting.dto';
import { MeetingIdDto } from '../dtos/request/create-meeting-id.dto';
import { PaginatedDto } from 'src/common/dtos/response/paginated.dto';
import { PageDto } from 'src/common/dtos/request/page.dto';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';

@Controller('recruiter/:recruiterId/meeting')
@ApiTags('Recruiters Endpoints')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Post('/jobAplication/:jobAplicationId')
  // @Auth({ permissions: [permissions.CREATE_.codename] })
  create(
    @Param() { jobAplicationId }: JobAplicationIdDto,
    @Body() createMeetingAplicationDto: CreateMeetingAplicationDto,
  ): Promise<MeetingDto> {
    return this.meetingService.create(
      jobAplicationId,
      createMeetingAplicationDto,
    );
  }

  // @Auth({ permissions: [permissions.READ_.codename] })
  @Get('/:meetingId')
  @ApiOperation({ summary: 'Get a meeting by id' })
  findOne(@Param() { meetingId }: MeetingIdDto): Promise<MeetingDto> {
    return this.meetingService.findOne(meetingId);
  }

  @Get('/jobAplication/:jobAplicationId')
  // @Auth({ permissions: [permissions.READ_.codename] })
  @ApiPaginatedResponse(MeetingDto)
  findAll(
    @Param() { jobAplicationId }: JobAplicationIdDto,
    @Query() pageDto: PageDto,
  ): Promise<PaginatedDto<MeetingDto>> {
    return this.meetingService.findAll(jobAplicationId, pageDto);
  }

  @Put('/:meetingId/jobAplication/:jobAplicationId')
  @ApiOperation({
    summary: 'Use this endpoint to Update a meeting by id and JobAplicationId',
  })
  // @Auth( { permissions: [permissions.UPDATE_.codename] })
  update(
    @Body() updateMeetingDto: CreateMeetingAplicationDto,
    @Param() { jobAplicationId }: JobAplicationIdDto,
    @Param() { meetingId }: MeetingIdDto,
  ): Promise<MeetingDto> {
    return this.meetingService.update(
      updateMeetingDto,
      jobAplicationId,
      meetingId,
    );
  }

  // @Auth({ permissions: [permissions.DELETE_.codename] })
  @ApiOperation({ summary: 'Use this endpoint to delete a meeting by id' })
  @Delete('/:meetingId')
  remove(@Param() { meetingId }: MeetingIdDto) {
    return this.meetingService.remove(meetingId);
  }
}
