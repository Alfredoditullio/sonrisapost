import { PrismaRepository } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

export interface FunnelParams {
  from: Date;
  to: Date;
}

export interface FunnelResponse {
  from: string;
  to: string;
  /** Embudo de activacion: cada escalon pierde gente, y saber donde es el punto */
  consultorios: {
    total: number;
    nuevos: number;
    conEspecialidad: number;
    conCanal: number;
    quePublicaron: number;
    activos30d: number;
  };
  porEspecialidad: { specialty: string; count: number }[];
  /** Derivacion al producto principal */
  promo: {
    clicks: number;
    consultoriosUnicos: number;
    porPlacement: { placement: string; count: number }[];
  };
  posts: {
    publicadosEnPeriodo: number;
    programadosPendientes: number;
  };
}

@Injectable()
export class PromoRepository {
  constructor(
    private _promoClick: PrismaRepository<'promoClick'>,
    private _organization: PrismaRepository<'organization'>,
    private _integration: PrismaRepository<'integration'>,
    private _post: PrismaRepository<'post'>
  ) {}

  registrarClick(organizationId: string, userId: string, placement: string) {
    return this._promoClick.model.promoClick.create({
      data: { organizationId, userId, placement },
    });
  }

  async getFunnel(params: FunnelParams): Promise<FunnelResponse> {
    const hace30dias = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const rango = { gte: params.from, lte: params.to };

    const [
      total,
      nuevos,
      conEspecialidad,
      especialidades,
      orgsConCanal,
      orgsQuePublicaron,
      orgsActivas,
      clicks,
      clicksUnicos,
      clicksPorPlacement,
      publicadosEnPeriodo,
      programadosPendientes,
    ] = await Promise.all([
      this._organization.model.organization.count(),
      this._organization.model.organization.count({
        where: { createdAt: rango },
      }),
      this._organization.model.organization.count({
        where: { specialty: { not: null } },
      }),
      this._organization.model.organization.groupBy({
        by: ['specialty'],
        where: { specialty: { not: null } },
        _count: { _all: true },
      }),
      // Un canal conectado es el primer escalon donde se pierde gente:
      // exige convertir la cuenta a profesional y pasar por OAuth.
      this._integration.model.integration.findMany({
        where: { deletedAt: null },
        distinct: ['organizationId'],
        select: { organizationId: true },
      }),
      this._post.model.post.findMany({
        where: { state: 'PUBLISHED', deletedAt: null },
        distinct: ['organizationId'],
        select: { organizationId: true },
      }),
      // La metrica que de verdad importa: quien sigue publicando.
      this._post.model.post.findMany({
        where: {
          state: 'PUBLISHED',
          deletedAt: null,
          publishDate: { gte: hace30dias },
        },
        distinct: ['organizationId'],
        select: { organizationId: true },
      }),
      this._promoClick.model.promoClick.count({ where: { createdAt: rango } }),
      this._promoClick.model.promoClick.findMany({
        where: { createdAt: rango },
        distinct: ['organizationId'],
        select: { organizationId: true },
      }),
      this._promoClick.model.promoClick.groupBy({
        by: ['placement'],
        where: { createdAt: rango },
        _count: { _all: true },
      }),
      this._post.model.post.count({
        where: { state: 'PUBLISHED', deletedAt: null, publishDate: rango },
      }),
      this._post.model.post.count({
        where: {
          state: 'QUEUE',
          deletedAt: null,
          publishDate: { gte: new Date() },
        },
      }),
    ]);

    return {
      from: params.from.toISOString(),
      to: params.to.toISOString(),
      consultorios: {
        total,
        nuevos,
        conEspecialidad,
        conCanal: orgsConCanal.length,
        quePublicaron: orgsQuePublicaron.length,
        activos30d: orgsActivas.length,
      },
      porEspecialidad: especialidades
        .map((e) => ({
          specialty: e.specialty || 'sin definir',
          count: e._count._all,
        }))
        .sort((a, b) => b.count - a.count),
      promo: {
        clicks,
        consultoriosUnicos: clicksUnicos.length,
        porPlacement: clicksPorPlacement
          .map((p) => ({ placement: p.placement, count: p._count._all }))
          .sort((a, b) => b.count - a.count),
      },
      posts: { publicadosEnPeriodo, programadosPendientes },
    };
  }
}
