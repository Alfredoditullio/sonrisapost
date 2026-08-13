# Contributing to DentalCore Social

Thanks for wanting to help.

## Licensing of contributions

There is **no CLA**. By opening a pull request you agree that your contribution
is licensed under the **GNU Affero General Public License v3**, the same license
as the rest of this project. You keep the copyright on your own work.

(The upstream Postiz project uses a CLA that assigns rights to its maintainers.
That agreement does not apply here, and its files were removed from this fork.)

## Before you start

- This is a fork of [Postiz](https://github.com/gitroomhq/postiz-app). If your fix
  applies to unmodified upstream code, consider sending it **upstream first** —
  everyone downstream benefits, and it lands here on the next merge.
- Read [`CLAUDE.md`](CLAUDE.md) — it documents the architecture, the layering
  rules (DTO → Controller → Service → Repository), and the frontend conventions.
- Upstream's [developer guide](https://docs.postiz.com/developer-guide) still
  describes most of the project structure accurately.

## Ground rules

- **pnpm only.** No npm, no yarn.
- **Prisma only.** Never write raw SQL.
- **No new frontend dependencies** from npm for UI components — write native ones.
- **Never edit a Temporal workflow that is already on the default branch.** Create
  a new versioned workflow instead; editing one breaks every in-flight activity.
- Lint from the repo root: `pnpm run lint`.
- Match the surrounding code. If your change looks like a new pattern, it probably
  is one — reuse what exists.

## Rebranding note

If you touch user-visible strings or artwork, do not reintroduce "Postiz" or
"Gitroom" branding. Attribution belongs in [`NOTICE.md`](NOTICE.md) and in the
source-code link component — not in the product chrome.

If you change how this fork differs from upstream, add it to the modifications
list in [`NOTICE.md`](NOTICE.md). AGPL-3.0 §5(a) requires that list to be accurate.

## Pull requests

Follow [`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md).
Keep PRs focused — one concern each.
