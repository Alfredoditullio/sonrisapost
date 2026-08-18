import { PrismaRepository } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ReglaComentario } from '@gitroom/helpers/comments/comment.matching';

export interface GuardarAutomatizacion {
  active: boolean;
  rules: ReglaComentario[];
  stopWords: string[];
  fallbackReply?: string | null;
  dailyLimit?: number;
}

@Injectable()
export class CommentAutomationRepository {
  constructor(
    private _automation: PrismaRepository<'commentAutomation'>,
    private _handled: PrismaRepository<'commentHandled'>
  ) {}

  obtener(organizationId: string, integrationId: string) {
    return this._automation.model.commentAutomation.findFirst({
      where: { organizationId, integrationId, deletedAt: null },
    });
  }

  listar(organizationId: string) {
    return this._automation.model.commentAutomation.findMany({
      where: { organizationId, deletedAt: null },
    });
  }

  /** Las que hay que revisar en cada pasada. */
  activas() {
    return this._automation.model.commentAutomation.findMany({
      where: { active: true, deletedAt: null },
      include: { integration: true },
    });
  }

  guardar(
    organizationId: string,
    integrationId: string,
    datos: GuardarAutomatizacion
  ) {
    const contenido = {
      active: datos.active,
      rules: datos.rules as any,
      stopWords: datos.stopWords as any,
      fallbackReply: datos.fallbackReply || null,
      dailyLimit: datos.dailyLimit || 30,
      // Reactiva una automatizacion que se habia borrado, en vez de dejar una
      // fila borrada bloqueando el unique de integrationId.
      deletedAt: null as Date | null,
    };

    return this._automation.model.commentAutomation.upsert({
      where: { integrationId },
      create: { organizationId, integrationId, ...contenido },
      update: contenido,
    });
  }

  /**
   * Marca un comentario como procesado.
   *
   * El unique (integrationId, commentId) es lo que evita responder dos veces:
   * si otra pasada ya lo anoto, esta no hace nada. Se apoya en la base y no en
   * un chequeo previo a proposito, porque dos revisiones simultaneas pasarian
   * las dos por el chequeo y responderian las dos.
   */
  async marcar(datos: {
    organizationId: string;
    integrationId: string;
    commentId: string;
    status: 'replied' | 'flagged' | 'ignored';
    comment?: string;
    authorName?: string;
    postId?: string;
  }) {
    try {
      await this._handled.model.commentHandled.create({ data: datos });
      return true;
    } catch (err) {
      // Choque con el unique: ya estaba procesado.
      return false;
    }
  }

  /**
   * Cuantas respuestas automaticas salieron hoy en este canal.
   *
   * Solo cuenta las respondidas: los comentarios frenados o ignorados no
   * gastan cupo porque no generan actividad hacia la red social.
   */
  async respuestasDeHoy(integrationId: string, desde: Date) {
    return this._handled.model.commentHandled.count({
      where: { integrationId, status: 'replied', createdAt: { gte: desde } },
    });
  }

  /** Ids ya procesados de una lista, para no volver a mirarlos. */
  async yaProcesados(integrationId: string, commentIds: string[]) {
    if (!commentIds.length) return new Set<string>();

    const filas = await this._handled.model.commentHandled.findMany({
      where: { integrationId, commentId: { in: commentIds } },
      select: { commentId: true },
    });

    return new Set(filas.map((f) => f.commentId));
  }

  /** Comentarios frenados que el profesional todavia no vio. */
  pendientes(organizationId: string) {
    return this._handled.model.commentHandled.findMany({
      where: { organizationId, status: 'flagged', seen: false },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  marcarVisto(organizationId: string, id: string) {
    return this._handled.model.commentHandled.updateMany({
      where: { id, organizationId },
      data: { seen: true },
    });
  }
}
