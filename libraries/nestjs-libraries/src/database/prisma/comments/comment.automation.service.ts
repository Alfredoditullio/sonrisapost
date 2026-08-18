import { Injectable, Logger } from '@nestjs/common';
import dayjs from 'dayjs';
import {
  CommentAutomationRepository,
  GuardarAutomatizacion,
} from '@gitroom/nestjs-libraries/database/prisma/comments/comment.automation.repository';
import { IntegrationManager } from '@gitroom/nestjs-libraries/integrations/integration.manager';
import { PrismaRepository } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import {
  aplicarVariables,
  decidirRespuesta,
  ReglaComentario,
} from '@gitroom/helpers/comments/comment.matching';

/** Cuantos dias hacia atras se miran las publicaciones. */
const DIAS_DE_VENTANA = 7;

@Injectable()
export class CommentAutomationService {
  private readonly logger = new Logger(CommentAutomationService.name);

  constructor(
    private _repo: CommentAutomationRepository,
    private _integrationManager: IntegrationManager,
    private _posts: PrismaRepository<'post'>
  ) {}

  obtener(organizationId: string, integrationId: string) {
    return this._repo.obtener(organizationId, integrationId);
  }

  listar(organizationId: string) {
    return this._repo.listar(organizationId);
  }

  pendientes(organizationId: string) {
    return this._repo.pendientes(organizationId);
  }

  marcarVisto(organizationId: string, id: string) {
    return this._repo.marcarVisto(organizationId, id);
  }

  guardar(
    organizationId: string,
    integrationId: string,
    datos: GuardarAutomatizacion
  ) {
    return this._repo.guardar(organizationId, integrationId, datos);
  }

  /**
   * Que canales pueden tener respuestas automaticas.
   *
   * Se pregunta por la capacidad y no por una lista de nombres: el dia que
   * otra red implemente fetchComments aparece sola, sin tocar esto.
   */
  soportaComentarios(providerIdentifier: string) {
    const proveedor =
      this._integrationManager.getSocialIntegration(providerIdentifier);

    return !!proveedor?.fetchComments && !!proveedor?.replyComment;
  }

  /** Una pasada completa: todas las automatizaciones activas. */
  async revisarTodas() {
    const activas = await this._repo.activas();

    for (const automatizacion of activas) {
      try {
        await this.revisarUna(automatizacion);
      } catch (err) {
        // Un canal roto (token vencido, permiso revocado) no puede frenar a
        // los demas: se registra y se sigue con el siguiente.
        this.logger.error(
          `Fallo la revision de comentarios del canal ${automatizacion.integrationId}`,
          err
        );
      }
    }
  }

  private async revisarUna(automatizacion: any) {
    const integracion = automatizacion.integration;
    if (!integracion || integracion.disabled || integracion.refreshNeeded) {
      return;
    }

    const proveedor = this._integrationManager.getSocialIntegration(
      integracion.providerIdentifier
    );
    if (!proveedor?.fetchComments || !proveedor?.replyComment) return;

    const publicaciones = await this._posts.model.post.findMany({
      where: {
        integrationId: integracion.id,
        state: 'PUBLISHED',
        deletedAt: null,
        releaseId: { not: null },
        // Los posts de traccion se excluyen: responder cientos de comentarios
        // con la misma plantilla se lee como spam, y la red puede limitar la
        // cuenta del consultorio.
        autoReplyComments: true,
        publishDate: {
          gte: dayjs().subtract(DIAS_DE_VENTANA, 'day').toDate(),
        },
      },
      select: { id: true, releaseId: true },
    });

    const reglas = (automatizacion.rules || []) as ReglaComentario[];
    const frenos = (automatizacion.stopWords || []) as string[];

    // Tope diario: red de seguridad para cuando alguien se olvida de apagar
    // el interruptor en un post que explota. Se calcula una vez y se lleva en
    // memoria durante la pasada, restando cada respuesta enviada.
    const tope = automatizacion.dailyLimit ?? 30;
    let restantes =
      tope -
      (await this._repo.respuestasDeHoy(
        integracion.id,
        dayjs().startOf('day').toDate()
      ));

    if (restantes <= 0) {
      this.logger.warn(
        `Canal ${integracion.id}: alcanzo el tope diario de ${tope} respuestas automaticas`
      );
      return;
    }

    for (const publicacion of publicaciones) {
      const comentarios = await proveedor.fetchComments(
        integracion.internalId,
        integracion.token,
        publicacion.releaseId!
      );

      const nuevos = comentarios.filter(
        // Nunca responderle a la propia cuenta: seria la automatizacion
        // hablando con ella misma.
        (c) => c.autorId !== integracion.internalId && c.texto?.trim()
      );

      const procesados = await this._repo.yaProcesados(
        integracion.id,
        nuevos.map((c) => c.id)
      );

      for (const comentario of nuevos) {
        if (procesados.has(comentario.id)) continue;

        const decision = decidirRespuesta(
          comentario.texto,
          reglas,
          frenos,
          automatizacion.fallbackReply
        );

        // Se anota ANTES de responder. Si el envio falla, el comentario queda
        // marcado y no se reintenta: preferimos no responder a responder dos
        // veces, que en publico se ve como un error del consultorio.
        const primeraVez = await this._repo.marcar({
          organizationId: automatizacion.organizationId,
          integrationId: integracion.id,
          commentId: comentario.id,
          status:
            decision.accion === 'responder'
              ? 'replied'
              : decision.accion === 'frenar'
              ? 'flagged'
              : 'ignored',
          comment: comentario.texto,
          authorName: comentario.autor,
          postId: publicacion.id,
        });

        if (!primeraVez || decision.accion !== 'responder') continue;

        if (restantes <= 0) return;
        restantes--;

        await proveedor.replyComment(
          integracion.internalId,
          integracion.token,
          comentario.id,
          aplicarVariables(decision.respuesta!, { nombre: comentario.autor })
        );
      }
    }
  }
}
