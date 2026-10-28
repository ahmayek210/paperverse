# Test raporu

Son güncelleme: 29 Ekim 2026 (Europe/Istanbul)

## Otomatik kontroller

| Kontrol | Kapsam |
|---|---|
| `npm run lint` | TypeScript/React kuralları |
| `npm run typecheck` | strict TypeScript |
| `npm run test` | 40 tür/8×5 dağılım, 10+ hareket, deterministik animasyon, undo/redo |
| `npm run test:e2e` | `/paperverse/` asset yükleme, 1280×720 ve 896×414 yatay görünüm, hash refresh |
| `npm run build` | production bundle ve GitHub Pages base path |

## Veritabanı kontrolleri

Migration atomik olarak canlı Paperverse projesine uygulanır. Ardından security/performance advisor, RLS kapsamı, private bucket, Data API grant'leri ve transaction tabanlı iki üye sınırı doğrulanır.

## Canlı kabul

Canlı URL ve iki ayrı browser context üzerinden anonim giriş/davet/çizim/Realtime/Storage kabul sonuçları, ilk GitHub Actions deployment'ından sonra bu rapora işlenir. Başarısız veya erişim nedeniyle yapılamayan senaryo yeşil gösterilmez.
