import { Injectable } from '@nestjs/common';
import { Activity, ActivityMethod } from 'nestjs-temporal-core';
import { CommentAutomationService } from '@gitroom/nestjs-libraries/database/prisma/comments/comment.automation.service';

@Injectable()
@Activity()
export class CommentAutomationActivity {
  constructor(private _commentAutomation: CommentAutomationService) {}

  @ActivityMethod()
  async revisarComentarios() {
    return this._commentAutomation.revisarTodas();
  }
}
