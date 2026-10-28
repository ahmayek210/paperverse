# Test raporu

Son güncelleme: 29 Ekim 2026 (Europe/Istanbul)

## Otomatik kontroller — geçti

| Kontrol | Kapsam |
|---|---|
| `npm run lint` | TypeScript/React kuralları |
| `npm run typecheck` | strict TypeScript |
| `npm run test` | 3 test dosyası, 6/6: 40 tür/8×5 dağılım, 10+ hareket, deterministik animasyon, undo/redo |
| `npm run test:e2e` | 6/6: `/paperverse/` asset yükleme, 1280×720 ve 896×414 Android yatay görünüm, hash refresh |
| `npm run build` | Başarılı; production bundle ve GitHub Pages base path |

## Veritabanı kontrolleri

İki migration atomik olarak canlı Paperverse projesine uygulandı. 11 public RLS policy, 4 Storage policy, private bucket, sıfır `anon` tablo grant'i ve Realtime publication doğrulandı. Rollback'li canlı DB güvenlik fixture sonucu:

- üçüncü üye insert'i reddedildi;
- ortak üyenin diğer üyeye ait çizim update'i 0 satır etkiledi;
- üye olmayan kullanıcı 0 creature satırı gördü;
- test transaction'ı rollback edildi; canlı projede test çöpü kalmadı.

Supabase advisor'da eksik RLS veya eksik FK index uyarısı yoktur. Dört kasıtlı `SECURITY DEFINER` RPC uyarısı kalır: bu RPC'ler davet ve üyelik transaction sınırıdır; `PUBLIC`/`anon` execute geri alınmış, `authenticated` ile `auth.uid()`/sahiplik kontrolü zorunludur. Yeni index'lerin henüz kullanılmamış görünmesi boş yeni proje için beklenir.

## GitHub Pages ve canlı kabul

- GitHub Actions run `40777826272`: başarılı (lint, typecheck, unit, Playwright, build, deploy).
- `https://ahmayek210.github.io/paperverse/`: HTTP 200, HTTPS zorunlu.
- `textures/cardboard.png`: HTTP 200, 293310 bayt.
- Canlı sayfa 1280×720 Chromium ile açılıp 3 saniye texture/font beklemesi sonrası görsel kontrol edildi.

## Açık hesap ayarı engeli

Supabase Auth API canlı denemesi `anonymous_provider_disabled` (HTTP 422) döndürdü. Bağlı Supabase aracı veritabanı, Storage ve Edge Functions'a erişiyor ancak Auth provider/Site URL ayarını değiştirecek bir yetenek sunmuyor; bu nedenle anonim giriş gerektiren iki-context senaryoları (dünya oluşturma, davet, çizim upload, canlı eşzamanlama ve hesap yükseltme) dürüstçe tamamlanmış sayılmadı.

Gerekli kullanıcı adımı: Supabase projesinde **Authentication → Sign In / Providers → Anonymous Sign-Ins** seçeneğini açın; ardından URL Configuration'da Site URL'yi `https://ahmayek210.github.io/paperverse/` yapıp aynı adresi Redirect URLs'e ekleyin. Bu ayardan sonra mevcut yayın yeniden build gerektirmeden anonim giriş kullanır.

Private Broadcast/Presence authorization policy hedefi için yeni projede `realtime.messages` ilişkisi henüz görünür değildir; güvenli RLS filtreli Postgres Changes kanalı canlı veri yenilemesini sağlar. Bu nedenle private-channel yetkisiz katılım kabulü ayrıca tamamlanmış sayılmadı.
