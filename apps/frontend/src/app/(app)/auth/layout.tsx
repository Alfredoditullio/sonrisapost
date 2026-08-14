import { getT } from '@gitroom/react/translation/get.translation.service.backend';

export const dynamic = 'force-dynamic';
import { ReactNode } from 'react';
import loadDynamic from 'next/dynamic';
import { LogoTextComponent } from '@gitroom/frontend/components/ui/logo-text.component';
import { SourceLinkComponent } from '@gitroom/frontend/components/ui/source-link.component';
import { ByDentalCoreComponent } from '@gitroom/frontend/components/ui/by-dentalcore.component';
const ReturnUrlComponent = loadDynamic(() => import('./return.url.component'));
export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const t = await getT();

  return (
    <div className="bg-[#0E0E0E] flex flex-1 p-[12px] gap-[12px] min-h-screen w-screen text-white">
      {/*<style>{`html, body {overflow-x: hidden;}`}</style>*/}
      <ReturnUrlComponent />
      <div className="flex flex-col py-[40px] px-[20px] flex-1 lg:w-[600px] lg:flex-none rounded-[12px] text-white p-[12px] bg-[#1A1919]">
        <div className="w-full max-w-[440px] mx-auto justify-center gap-[20px] h-full flex flex-col text-white">
          <div className="flex flex-col gap-[6px]">
            <LogoTextComponent />
            <ByDentalCoreComponent />
          </div>
          <div className="flex">{children}</div>
          <SourceLinkComponent />
        </div>
      </div>
      <div className="flex-1 pt-[88px] hidden lg:flex flex-col items-center px-[40px]">
        <div className="text-center text-[36px] leading-[1.2]">
          {t('auth_headline', 'Every social channel,')}
          <br />
          <span className="text-[#2DD4BF]">
            {t('auth_headline_accent', 'one shared calendar')}
          </span>
        </div>
        <div className="mt-[24px] text-center text-[16px] text-[#B5B5B5] max-w-[520px]">
          {t(
            'auth_free_forever',
            'DentalCore Social is free and open source. No post limits, no credit card.'
          )}
        </div>
        <div className="mt-[40px] grid grid-cols-2 gap-[12px] w-full max-w-[560px]">
          {[
            [
              t('auth_feature_calendar', 'Calendar'),
              t(
                'auth_feature_calendar_body',
                'Plan and drag your posts across dates and times.'
              ),
            ],
            [
              t('auth_feature_channels', '28+ channels'),
              t(
                'auth_feature_channels_body',
                'Instagram, TikTok, LinkedIn, X, YouTube and more.'
              ),
            ],
            [
              t('auth_feature_team', 'Team'),
              t(
                'auth_feature_team_body',
                'Invite colleagues and approve content before it goes out.'
              ),
            ],
            [
              t('auth_feature_analytics', 'Analytics'),
              t(
                'auth_feature_analytics_body',
                'See what works on every network from one place.'
              ),
            ],
          ].map(([title, body]) => (
            <div
              key={title}
              className="rounded-[16px] p-[20px] bg-[#1A1919] border border-[#2b2a2a] text-left"
            >
              <div className="text-[16px] font-[700]">{title}</div>
              <div className="mt-[6px] text-[13px] font-[400] text-[#D1D1D1]">
                {body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
