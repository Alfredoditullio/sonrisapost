/**
 * AGPL-3.0 section 13 compliance.
 *
 * SonrisaPost is a modified version of Postiz (https://github.com/gitroomhq/postiz-app),
 * licensed under the GNU Affero General Public License v3. Because this program is offered to
 * users over a network, every user must be given a prominent opportunity to receive the
 * corresponding source of THIS modified version — not just of upstream Postiz.
 *
 * Point NEXT_PUBLIC_SOURCE_CODE_URL at the public repository holding the exact code you deploy.
 * Do not remove this component.
 */
export const SOURCE_CODE_URL =
  process.env.NEXT_PUBLIC_SOURCE_CODE_URL ||
  'https://github.com/Alfredoditullio/sonrisapost';

export const SourceLinkComponent = () => {
  return (
    <div className="text-[12px] text-center text-[#8E8E8E] leading-[1.6]">
      <a
        href={SOURCE_CODE_URL}
        target="_blank"
        rel="noreferrer"
        className="underline hover:text-white"
      >
        Source code
      </a>{' '}
      — AGPL-3.0. Based on{' '}
      <a
        href="https://github.com/gitroomhq/postiz-app"
        target="_blank"
        rel="noreferrer"
        className="underline hover:text-white"
      >
        Postiz
      </a>{' '}
      by Nevo David.
    </div>
  );
};
