# Paperverse mimarisi

## İstemci

Vite + React + strict TypeScript kullanılır. Uygulama GitHub Pages'te `/paperverse/` tabanından statik olarak çalışır; davetler hash URL kullandığı için yenilemede 404 oluşmaz.

- `src/game`: 8 biyomun Canvas dekoru, kamera, renderer, 40 türlük veri kayıt sistemi ve deterministik animasyon motoru.
- `src/editor`: Pointer Events tabanlı pressure destekli fırça, gerçek alfa silgisi, stroke geçmişi ve şeffaf WEBP dışa aktarımı.
- `src/services`: Auth, dünya/davet RPC'leri, private Storage, creature CRUD ve Realtime/Presence uzlaştırması.
- `src/ui`: atölye haritası, dünya görünümü, editör, galeri, bilgi kartı ve profil akışları.

Renderer tek Canvas kullanır; her yaratık için DOM düğümü üretmez. Pozisyon, kalıcı `motion_seed`, oluşturulma zamanı ve saat fazından yeniden hesaplanır. İstemciler animasyon karesini veritabanına yazmaz. Kamera dışındaki sprite'lar çizimden elenir; device pixel ratio en fazla 2 ile sınırlandırılır.

## Veri ve güvenlik

Canonical kaynak Supabase Postgres'tir. `paperverse_private` şemasındaki dar üyelik yardımcıları RLS recursion'ını önler. Public RPC'ler `PUBLIC`/`anon` rolünden geri alınmış, yalnızca `authenticated` rolüne verilmiştir ve `auth.uid()` doğrular.

Storage yolu `worldId/userId/creatureId.webp` biçimindedir; tablo check constraint'i yol ile satır sahipliğini eşler. Metadata insert başarısız olursa istemci upload'ı temizler. Delete soft-delete kaydı ile Storage temizliğini birlikte yürütür.

Realtime bir hızlandırma katmanıdır. RLS korumalı `postgres_changes` kanalı veri değişikliklerinde tam DB refetch başlatır; private Broadcast/Presence etkin olduğunda daha hızlı sinyal ve çevrimiçi adları sağlar. Yeniden bağlanma da snapshot uzlaştırması tetikler. Kalıcılık hiçbir Realtime kanalına bağlı değildir.

## Hareket davranışları

`swim`, `hover`, `pulse`, `jet`, `walk`, `hop`, `flutter`, `sprint`, `glide`, `patrol`, `orbit`, `slide` davranışları tür profillerinin hız, duraklama, boyut, iz, sınır ve tepki parametreleriyle birleşir. Anatomik uzuv tespiti yapılmış gibi davranılmaz; tam sprite, squash/stretch, yön, gölge ve iz kullanılır.
