import { Injectable } from '@nestjs/common';
import {
  FunnelParams,
  PromoRepository,
} from '@gitroom/nestjs-libraries/database/prisma/promo/promo.repository';

@Injectable()
export class PromoService {
  constructor(private _promoRepository: PromoRepository) {}

  registrarClick(organizationId: string, userId: string, placement: string) {
    return this._promoRepository.registrarClick(
      organizationId,
      userId,
      placement
    );
  }

  getFunnel(params: FunnelParams) {
    return this._promoRepository.getFunnel(params);
  }
}
