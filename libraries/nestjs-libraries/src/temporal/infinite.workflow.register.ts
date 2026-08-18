import { Global, Injectable, Module, OnModuleInit } from '@nestjs/common';
import { TemporalService } from 'nestjs-temporal-core';

@Injectable()
export class InfiniteWorkflowRegister implements OnModuleInit {
  constructor(private _temporalService: TemporalService) {}

  async onModuleInit(): Promise<void> {
    if (!!process.env.RUN_CRON) {
      try {
        await this._temporalService.client
          ?.getRawClient()
          ?.workflow?.start('missingPostWorkflow', {
            workflowId: 'missing-post-workflow',
            taskQueue: 'main',
          });
      } catch (err) {}

      // Respuestas automaticas a comentarios. Un solo flujo para toda la
      // instalacion: recorre las automatizaciones activas en cada pasada.
      // El workflowId fijo hace que arrancar de nuevo sea inofensivo, porque
      // Temporal rechaza un segundo flujo con el mismo id.
      try {
        await this._temporalService.client
          ?.getRawClient()
          ?.workflow?.start('commentAutomationWorkflow', {
            workflowId: 'comment-automation-workflow',
            taskQueue: 'main',
          });
      } catch (err) {}
    }
  }
}

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [InfiniteWorkflowRegister],
  get exports() {
    return this.providers;
  },
})
export class InfiniteWorkflowRegisterModule {}
