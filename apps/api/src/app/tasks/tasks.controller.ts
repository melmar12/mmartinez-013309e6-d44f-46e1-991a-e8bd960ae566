import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  CreateTaskDto,
  TaskDto,
  TaskListFilter,
  UpdateTaskDto,
  JwtPayload,
  TaskStatus,
} from '@mmartinez-013309e6-d44f-46e1-991a-e8bd960ae566/data';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '@mmartinez-013309e6-d44f-46e1-991a-e8bd960ae566/auth';
import { RolesGuard } from '@mmartinez-013309e6-d44f-46e1-991a-e8bd960ae566/auth';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard) // all routes require a valid JWT
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @Roles('viewer', 'admin', 'owner')
  findAll(
    @Req() req,
    @Query('status') status?: TaskStatus,
  ): TaskDto[] {
    const user = req.user as JwtPayload;
    const filter: TaskListFilter = {};
    if (status) {
      filter.status = status;
    }
    return this.tasksService.findAllForUser(user, filter);
  }

  @Post()
  @Roles('admin', 'owner')
  create(@Req() req, @Body() dto: CreateTaskDto): TaskDto {
    const user = req.user as JwtPayload;
    return this.tasksService.create(user, dto);
  }

  @Put(':id')
  @Roles('admin', 'owner')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ): TaskDto {
    const user = req.user as JwtPayload;
    return this.tasksService.update(user, id, dto);
  }

  @Delete(':id')
  @Roles('admin', 'owner')
  remove(@Req() req, @Param('id') id: string): void {
    const user = req.user as JwtPayload;
    return this.tasksService.remove(user, id);
  }
}
