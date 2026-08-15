import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Organization, User } from '@prisma/client';
import { GetOrgFromRequest } from '@gitroom/nestjs-libraries/user/org.from.request';
import { GetUserFromRequest } from '@gitroom/nestjs-libraries/user/user.from.request';
import { PromoService } from '@gitroom/nestjs-libraries/database/prisma/promo/promo.service';
import { PromoClickDto } from '@gitroom/nestjs-libraries/dtos/promo/promo.click.dto';

@ApiTags('Promo')
@Controller('/promo')
export class PromoController {
  constructor(private _promoService: PromoService) {}

  /**
   * Registra un clic en el banner de DentalCore. Es la unica medicion que
   * dice si la herramienta gratuita cumple su funcion de derivar al
   * producto principal.
   */
  @Post('/click')
  async click(
    @GetOrgFromRequest() org: Organization,
    @GetUserFromRequest() user: User,
    @Body() body: PromoClickDto
  ) {
    await this._promoService.registrarClick(org.id, user.id, body.placement);
    return { ok: true };
  }
}
