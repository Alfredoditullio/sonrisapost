import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Organization } from '@prisma/client';
import { GetOrgFromRequest } from '@gitroom/nestjs-libraries/user/org.from.request';
import { CommentAutomationService } from '@gitroom/nestjs-libraries/database/prisma/comments/comment.automation.service';
import { CommentAutomationDto } from '@gitroom/nestjs-libraries/dtos/comments/comment.automation.dto';

@ApiTags('Comment Automation')
@Controller('/comment-automation')
export class CommentAutomationController {
  constructor(private _service: CommentAutomationService) {}

  @Get('/')
  listar(@GetOrgFromRequest() org: Organization) {
    return this._service.listar(org.id);
  }

  /** Comentarios frenados por una palabra de alerta, sin ver todavia. */
  @Get('/pending')
  pendientes(@GetOrgFromRequest() org: Organization) {
    return this._service.pendientes(org.id);
  }

  @Post('/pending/:id/seen')
  marcarVisto(
    @GetOrgFromRequest() org: Organization,
    @Param('id') id: string
  ) {
    return this._service.marcarVisto(org.id, id);
  }

  @Get('/:integrationId')
  obtener(
    @GetOrgFromRequest() org: Organization,
    @Param('integrationId') integrationId: string
  ) {
    return this._service.obtener(org.id, integrationId);
  }

  @Put('/:integrationId')
  guardar(
    @GetOrgFromRequest() org: Organization,
    @Param('integrationId') integrationId: string,
    @Body() body: CommentAutomationDto
  ) {
    return this._service.guardar(org.id, integrationId, body);
  }
}
