import { Injectable, Logger } from '@nestjs/common';
import {
  AiUsageRepository,
  RegistroConsumo,
} from '@gitroom/nestjs-libraries/database/prisma/ai-usage/ai.usage.repository';
import {
  costoEnMicros,
  faltanPrecios,
} from '@gitroom/nestjs-libraries/ai/ai.pricing';

@Injectable()
export class AiUsageService {
  private readonly logger = new Logger(AiUsageService.name);
  private avisoPreciosDado = false;

  constructor(private _repo: AiUsageRepository) {}

  /**
   * Registra una llamada a IA.
   *
   * Nunca lanza: medir es importante, pero no al punto de romperle la
   * respuesta al usuario si falla la escritura. Un error de medicion se
   * registra en el log y sigue.
   */
  async registrar(
    datos: Omit<RegistroConsumo, 'costMicros'> & { imagenes?: number; videos?: number }
  ) {
    try {
      if (faltanPrecios() && !this.avisoPreciosDado) {
        this.avisoPreciosDado = true;
        this.logger.warn(
          'Falta cargar los precios de IA (AI_PRICE_*). Se siguen guardando ' +
            'tokens y unidades, pero el costo queda en cero hasta cargarlos.'
        );
      }

      await this._repo.create({
        ...datos,
        costMicros: costoEnMicros({
          inputTokens: datos.inputTokens,
          outputTokens: datos.outputTokens,
          imagenes: datos.imagenes,
          videos: datos.videos,
        }),
      });
    } catch (err) {
      this.logger.error('No se pudo registrar el consumo de IA', err);
    }
  }

  consumoDesde(organizationId: string, desde: Date, kind?: string) {
    return this._repo.contarDesde(organizationId, desde, kind);
  }

  resumen(desde: Date, hasta: Date) {
    return this._repo.resumen(desde, hasta);
  }
}
