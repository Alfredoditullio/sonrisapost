import { PrismaRepository } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

export interface RegistroConsumo {
  organizationId: string;
  kind: 'agent' | 'image' | 'video';
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  units?: number;
  costMicros?: number;
  steps?: number;
  hitLimit?: boolean;
}

@Injectable()
export class AiUsageRepository {
  constructor(
    private _aiUsage: PrismaRepository<'aiUsage'>
  ) {}

  create(datos: RegistroConsumo) {
    return this._aiUsage.model.aiUsage.create({
      data: {
        organizationId: datos.organizationId,
        kind: datos.kind,
        model: datos.model,
        inputTokens: datos.inputTokens || 0,
        outputTokens: datos.outputTokens || 0,
        units: datos.units || 0,
        costMicros: datos.costMicros || 0,
        steps: datos.steps || 0,
        hitLimit: datos.hitLimit || false,
      },
    });
  }

  /** Consumo de una organizacion desde una fecha. Para el chequeo de cupo. */
  async contarDesde(organizationId: string, desde: Date, kind?: string) {
    const agrupado = await this._aiUsage.model.aiUsage.aggregate({
      where: {
        organizationId,
        createdAt: { gte: desde },
        ...(kind ? { kind } : {}),
      },
      _count: { id: true },
      _sum: { costMicros: true, units: true },
    });

    return {
      llamadas: agrupado._count.id || 0,
      unidades: agrupado._sum.units || 0,
      costMicros: agrupado._sum.costMicros || 0,
    };
  }

  /**
   * Resumen global por tipo. La distribucion importa mas que el promedio:
   * si un tipo de llamada tiene un maximo muy por encima de la media, ese es
   * el que se come el margen y el que hay que acotar.
   */
  async resumen(desde: Date, hasta: Date) {
    const filas = await this._aiUsage.model.aiUsage.findMany({
      where: { createdAt: { gte: desde, lte: hasta } },
      select: {
        kind: true,
        costMicros: true,
        steps: true,
        hitLimit: true,
        organizationId: true,
      },
    });

    const porTipo = new Map<
      string,
      { costos: number[]; hitLimit: number; orgs: Set<string> }
    >();

    for (const f of filas) {
      const acc = porTipo.get(f.kind) || {
        costos: [],
        hitLimit: 0,
        orgs: new Set<string>(),
      };
      acc.costos.push(f.costMicros);
      if (f.hitLimit) acc.hitLimit++;
      acc.orgs.add(f.organizationId);
      porTipo.set(f.kind, acc);
    }

    return [...porTipo.entries()].map(([kind, acc]) => {
      const ordenados = [...acc.costos].sort((a, b) => a - b);
      const total = ordenados.reduce((a, b) => a + b, 0);
      // El percentil 95 es el numero con el que se pone precio: cubrir el
      // promedio deja que el 5% mas pesado se lleve la ganancia del resto.
      const p95 =
        ordenados.length === 0
          ? 0
          : ordenados[
              Math.min(
                ordenados.length - 1,
                Math.ceil(ordenados.length * 0.95) - 1
              )
            ];

      return {
        kind,
        llamadas: ordenados.length,
        organizaciones: acc.orgs.size,
        cortadasPorTope: acc.hitLimit,
        costoTotalMicros: total,
        costoPromedioMicros: ordenados.length
          ? Math.round(total / ordenados.length)
          : 0,
        costoP95Micros: p95,
        costoMaximoMicros: ordenados[ordenados.length - 1] || 0,
      };
    });
  }
}
