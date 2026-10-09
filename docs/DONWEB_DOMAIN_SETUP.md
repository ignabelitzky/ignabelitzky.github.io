# DonWeb domain setup — Ignacio Belitzky portfolio

## DO NOT EXECUTE UNTIL PURCHASED AND AUTHORIZED

The owner confirmed purchase of `ignaciobelitzky.dev` at DonWeb and authorized Phase 8 on 2026-10-09. The canonical host is `https://ignaciobelitzky.dev/`; `www` redirects to this apex host. This guide records the configuration approach. Successful release/HTTPS results must be established separately from actual evidence.

## 1. Inspect the account and existing services

Sign in securely at DonWeb Mi cuenta. Go to **Mis Servicios → Dominios → Gestionar → Nameservers y Zona DNS** for `ignaciobelitzky.dev`. Confirm the registered domain and inspect existing DNS before editing. The initial account had only domain/SSL service categories, no domain email service was found, and this domain had no DNS zone. Public DNS initially returned SERVFAIL. There were no existing MX/SPF/DKIM/DMARC records to alter. This is not a claim that a domain cannot support email later.

DonWeb displayed `ns1.donweb.com` and `ns2.donweb.com`; they were retained. After zone creation, public DNS confirmed both NS records. No registrar transfer or nameserver replacement was needed. Do not reset or delete the zone to perform a website migration.

## 2. Generate the actual ownership verification record

In GitHub personal **Settings → Pages → Add a domain**, enter `ignaciobelitzky.dev`. Copy the exact TXT hostname and value generated for account `ignabelitzky`. The hostname for this account is `_github-pages-challenge-ignabelitzky.ignaciobelitzky.dev`. Keep the value from the live GitHub screen; do not invent or reuse a token from another account/domain.

DonWeb's initial zone wizard required an apex A record before other records could be added. Therefore the domain was first associated with the owned GitHub repository, then the zone was initialized directly with a documented GitHub Pages A address. The automatically proposed `www → apex` CNAME was corrected to `www → ignabelitzky.github.io` before saving. The generated TXT record was then added, publicly resolved and verified in GitHub personal Pages settings. Keep that TXT record after verification. Where an existing zone permits it, complete ownership verification before associating a custom domain.

## 3. Configure the GitHub Pages custom domain

Open `ignabelitzky/ignabelitzky.github.io` → **Settings → Pages**. Keep Source **GitHub Actions**. Set **Custom domain** to `ignaciobelitzky.dev` and save. Do not include `https://` or `www` in that field. For this Actions-based publishing source, a repository CNAME file is not needed. The repository setting determines the custom domain.

## 4. Create and save DNS records

Use **Configuración manual → Configurar → Crear zona DNS** if needed. The initial wizard requires an A record; use `185.199.108.153` for the apex. Review the generated records before **Guardar**. Then use **Agregar registro** for additional entries. DonWeb's Name field accepts the full hostname; enter the full names below. TTL used during this execution was DonWeb's default `14400` seconds (four hours).

| Type | DonWeb Name | Content |
| --- | --- | --- |
| A | ignaciobelitzky.dev | 185.199.108.153 |
| A | ignaciobelitzky.dev | 185.199.109.153 |
| A | ignaciobelitzky.dev | 185.199.110.153 |
| A | ignaciobelitzky.dev | 185.199.111.153 |
| AAAA | ignaciobelitzky.dev | 2606:50c0:8000::153 |
| AAAA | ignaciobelitzky.dev | 2606:50c0:8001::153 |
| AAAA | ignaciobelitzky.dev | 2606:50c0:8002::153 |
| AAAA | ignaciobelitzky.dev | 2606:50c0:8003::153 |
| CNAME | www.ignaciobelitzky.dev | ignabelitzky.github.io |
| TXT | _github-pages-challenge-ignabelitzky.ignaciobelitzky.dev | Exact current GitHub verification value |

Retain DonWeb's NS/SOA records. No MX, mail authentication, wildcard or unrelated records were added or deleted. Use GitHub's redirect between apex/www; do not enable a second DonWeb parking/redirect service. Recheck GitHub's official address list before a future migration.

## 5. Update the source and release

Set both `astro.config.mjs` `site` and `src/data/site.ts` `origin` to `https://ignaciobelitzky.dev`. Keep the site rooted at `/` without `base`. Update domain assertions in the built-output/source audits and the external-link checker's own-origin setting. The shared layout derives canonical, hreflang, Open Graph and schema URLs; sitemap and robots must use the same canonical domain.

Install locked dependencies and run `npm run validate`. Upload/commit the reviewed source changes, inspect successful CI on the actual main SHA, set `PAGES_APPROVED_SHA` to that full SHA, and manually dispatch **Manual Pages release** on main with the same `approved_sha` and `confirmation=PUBLISH`. Inspect both build and deployment logs. Clear the approval marker to `NOT_APPROVED` after release. A push runs validation only; it must not deploy automatically. See GITHUB_PAGES_DEPLOYMENT.md.

## 6. HTTPS, redirects and final verification

Allow GitHub's DNS check/certificate provisioning to finish. Select **Enforce HTTPS** when it becomes available, and verify the saved checked state. Do not declare completion from a configured-domain message alone. Open apex and www securely; confirm www redirects to apex and localized/project paths survive redirects. `.dev` needs working HTTPS. Never bypass a certificate warning to claim success.

On Fedora, if needed install DNS/curl utilities from the distribution repositories, then run:

```bash
sudo dnf install bind-utils curl

dig NS ignaciobelitzky.dev +short
dig A ignaciobelitzky.dev +short
dig AAAA ignaciobelitzky.dev +short
dig CNAME www.ignaciobelitzky.dev +short
dig TXT _github-pages-challenge-ignabelitzky.ignaciobelitzky.dev +short
dig MX ignaciobelitzky.dev +short
dig CAA ignaciobelitzky.dev +short

curl -I https://ignaciobelitzky.dev/
curl -I https://www.ignaciobelitzky.dev/
curl -IL https://www.ignaciobelitzky.dev/es/
curl -IL https://ignabelitzky.github.io/projects/qt-rss-reader/
curl -I https://ignaciobelitzky.dev/es/
curl -I https://ignaciobelitzky.dev/phase8-route-that-does-not-exist/
```

Expect the two DonWeb NS, four GitHub IPv4/IPv6 addresses, www CNAME and actual verification TXT. Apex pages should respond 200 over valid HTTPS. www should redirect to the same apex path. An unknown route should respond 404 with the portfolio's custom error page. Verify assets, canonical/alternate URLs, robots/sitemaps, both locales, responsive rendering and no mixed content. Compare downloaded live bytes to the actual released artifact.

## 7. Troubleshooting and recovery

DNS caches and certificate issuance may take time; compare the saved zone with authoritative/public DNS first. Avoid changing nameservers merely to accelerate propagation. If mail is added later, preserve its MX/SPF/DKIM/DMARC records. If DNS is delegated to another provider later, manage records there rather than in an inactive DonWeb zone.

For an owner-authorized return to github.io: review/release a commit that restores both origins and matching audit expectations to `https://ignabelitzky.github.io`, remove the repository's custom domain, and verify the original HTTPS site. Before removing an association, remove/repoint the domain's GitHub web DNS records to avoid leaving an unbound website hostname. Keep ownership verification TXT and unrelated DNS. Restore only the specific web records that were changed; do not reset the whole zone. The initial verified portfolio source is commit `0e4f50b45fe83f3e2748e4ae4e6236d663f1ad0f`; use a new reviewed revert/fix commit on main with successful CI and the manual exact-SHA release.

## Official references checked 2026-10-09

- [DonWeb DNS zone management](https://soporte.donweb.com/es/articles/15901641-dominios-y-zona-dns-gestionar-la-zona-dns-de-tu-dominio)
- [GitHub custom-domain configuration](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [GitHub domain ownership verification](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
- [GitHub Pages HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
