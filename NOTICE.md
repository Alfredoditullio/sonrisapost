# NOTICE — Attribution and modifications

DentalCore Social is a **modified version** of **Postiz**
(<https://github.com/gitroomhq/postiz-app>), copyright © Nevo David and the Postiz
contributors, licensed under the **GNU Affero General Public License, version 3**.

DentalCore Social is **not** affiliated with, endorsed by, or sponsored by Postiz,
Gitroom, or Nevo David. "Postiz" and "Gitroom" are names used by the upstream
project and are **not** licensed to this project; they appear here only to
identify the origin of the code, as required for attribution.

DentalCore Social is distributed under the same license — **AGPL-3.0**. See
[`LICENSE`](LICENSE) for the full text. The original copyright notice in
`LICENSE` is preserved unchanged, as the license requires.

## Fork point

| | |
|---|---|
| Upstream | `gitroomhq/postiz-app` |
| Upstream version | `v1.47.0` |
| Upstream commit | `3e00590` |
| Forked on | 2026-08-13 |

## Modifications made in this fork

Required by AGPL-3.0 §5(a) — "carry prominent notices stating that you modified it".

1. **Rebranding.** All user-visible occurrences of "Postiz" and "Gitroom" replaced
   with "DentalCore Social". Environment-variable prefix `POSTIZ_*` renamed to
   `DENTALCORE_*`.
2. **Logo and icon artwork replaced.** The Postiz wordmark and glyph (an original
   creative work of the upstream authors) were removed entirely and replaced with
   original DentalCore Social artwork. Affected: `apps/frontend/public/logo.svg`,
   `logo-text.svg`, `dentalcore.svg`, `dentalcore-text.svg`, favicons, the
   extension icons, and the inline SVG components `logo-text.component.tsx` and
   `new-layout/logo.tsx`.
3. **Brand colour** changed from `#612BD3` (Postiz purple) to `#0F766E` /
   `#2DD4BF` (teal).
4. **Third-party testimonials removed.** The login screen carried real, named
   people endorsing Postiz, with their photographs. Presenting those endorsements
   under a different brand would misrepresent them, so the testimonial components,
   the testimonial data, and `public/auth/avatars/` were deleted and the login
   screen was replaced with a neutral product panel.
5. **Upstream analytics disconnected.** Hardcoded Plausible and Datafast domains
   (`postiz.com` / `gitroom.com`) replaced with the opt-in environment variable
   `NEXT_PUBLIC_ANALYTICS_DOMAIN`, so this deployment never reports traffic to
   upstream.
6. **Upstream funding and sponsor material removed.** `.github/FUNDING.yaml`,
   `.github/sponsors/`, and the Gitroom logo assets were deleted so that no
   donation flow under this brand is routed to the upstream author.
7. **Contributor License Agreements removed.** `ICLA.md` and `CCLA.md` assigned
   rights to the upstream project and do not apply to this fork.
8. **AGPL §13 source link added** — `apps/frontend/src/components/ui/source-link.component.tsx`,
   rendered in the UI, pointing at the public source of this modified version.
9. Container registry and repository references retargeted away from `gitroomhq`.

Documentation links to `docs.postiz.com` were deliberately **left intact** where
they describe upstream behaviour that this fork has not changed. They are
accurate, and they credit the source.

## Your obligations if you deploy or redistribute this

- Keep this file, `LICENSE`, and the source-link component in place.
- Publish the exact source you run, and point `NEXT_PUBLIC_SOURCE_CODE_URL` at it.
- License any further modifications under AGPL-3.0.
- Record your own changes in the list above.
