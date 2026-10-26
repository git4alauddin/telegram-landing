# Telegram landing page V1

A static landing page for a Meta Traffic campaign. The page records a Meta Pixel `PageView` on load and a custom `TelegramClick` when someone manually clicks **Join Telegram**. A click does not confirm that the person joined a channel.

## Change channel details

Edit `config.js` to change the channel name, brief description, active-member display value, picture, or Telegram invite URL. The current picture is the path set in `displayPicture`. To use your own local picture, put it in `assets/` and set `displayPicture` to its path, such as `./assets/my-channel.webp`; a full HTTPS image URL also works. If the picture cannot load, the page shows the first letter of the channel name instead. The member value is manually maintained, so update it when the channel changes. `config.js` is publicly served; do not put secrets in it.

Set `advertisingManager` and `advertisingEmail` to show the advertising contact strip below the join card. The email is displayed as text, without a link. The strip remains hidden while either value is blank or the email does not have a basic `name@domain.extension` format. The current advertising email is `contact@kalam.trade`.

## Live deployment and verification

The current page uses a small WebP avatar and tag texture, system fonts, deferred page scripts, and an asynchronous Meta Pixel script. The tag lettering is HTML text. The channel name and invite URL in `index.html` are fallbacks for visitors whose JavaScript is delayed or disabled; keep these consistent with `config.js` when changing channels.

Previously verified URL (2026-10-04): https://dark-wind-4e8c.edudot1234.workers.dev/

The earlier page was deployed as a Cloudflare Worker. On 2026-10-04, the owner confirmed it worked and provided a Meta Events Manager **Test Events** screenshot showing `PageView` and `TelegramClick` as **Processed**. The screenshot also showed `SubscribedButtonClick` as **Automatically logged**. That extra event does not confirm a Telegram join and should not be used as the campaign's CTA metric. The `PageView` row was labelled **Custom event** in Meta's screenshot; the source code calls `fbq('track', 'PageView')`. The current `wrangler.jsonc` names `meta-camp-landing-page`, so confirm the production Worker and URL in Cloudflare before using the site for ads.

Campaign destination example from the earlier deployment:

```text
https://dark-wind-4e8c.edudot1234.workers.dev/?utm_source=meta&utm_medium=paid_social&utm_campaign=telegram_v1&utm_content=creative_1
```

## Before using it for ads

1. Review the channel name, description, active-member value, picture, and invite URL in `config.js` before launch.
2. Review the information-only disclaimer in `index.html`.
3. The Meta Pixel ID is `28537605579214881` in `index.html`. Update both the JavaScript initialization and the `noscript` image URL if the Pixel changes.
4. Confirm that your site notice and privacy information meet the requirements that apply to your campaign.

## Deploy on Render

This project can run as a Render Static Site. `render.yaml` defines the deployment: it copies the four page files and `assets/` into `dist/`, then publishes that directory. It does not install dependencies or compile the page. Render does not use `wrangler.jsonc` or `.assetsignore`.

1. Commit and push `render.yaml`, `.gitignore`, and this README to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com/), select **New > Blueprint** and connect `git4alauddin/telegram-landing`.
3. Select `main` and use the repository's `render.yaml`. Review the Static Site resource and deploy it.
4. Open the URL Render assigns, check the images, and manually test **Join Telegram**. Use Meta Events Manager **Test Events** to verify `PageView` and `TelegramClick` on the new URL.

Alternatively, select **New > Static Site**, connect the same repository, and use these settings:

| Setting | Value |
| --- | --- |
| Branch | `main` |
| Root Directory | Leave blank |
| Build Command | `mkdir -p dist && cp index.html style.css script.js config.js dist/ && cp -R assets dist/` |
| Publish Directory | `dist` |
| Environment variable | `SKIP_INSTALL_DEPS=true` |

Use either the Blueprint flow or the manual Static Site flow to create one site. Subsequent pushes to `main` automatically deploy updates. See [Render Static Sites](https://render.com/docs/static-sites) and [Render Blueprints](https://render.com/docs/infrastructure-as-code).

## Deploy on Cloudflare

The repository root contains `wrangler.jsonc`, which names the Worker to deploy and serves this directory as static assets. `.assetsignore` limits the public assets to `index.html`, `style.css`, `script.js`, `config.js`, and files in `assets/`.

To connect the Worker, open **Workers & Pages** in Cloudflare, select the Worker whose name matches `wrangler.jsonc`, then go to **Settings → Builds → Connect**. Select the GitHub or GitLab repository containing these files, choose the production branch, use the repository root as the build root, leave the build command empty, and use `npx wrangler deploy` as the deploy command. A push to the selected production branch should then build and deploy the changed files to that Worker. The site itself has no build framework or runtime dependencies.

After each deployment, check the public URL with campaign parameters such as `?utm_source=meta&utm_medium=paid_social&utm_campaign=telegram_v1&utm_content=creative_1`. The page leaves these parameters in the address bar, so they remain part of the page URL available to the Pixel. In Meta Events Manager, use **Test Events** to confirm `PageView` appears on page load and `TelegramClick` appears only after a manual CTA click. Test with browser extensions that block tracking disabled.

The page does not auto-redirect or claim to track Telegram membership.
