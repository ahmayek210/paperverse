# Paperverse

**Çiz. Canlandır. Birlikte yaşat.** Paperverse, iki kişinin kendi çizdiği canlılarla sekiz kâğıt biyomu birlikte doldurduğu kalıcı Türkçe bir web oyunudur.

Canlı sürüm: <https://ahmayek210.github.io/paperverse/>

## İlk dünya ve Ada'yı davet etme

1. **Dünyaya gir** düğmesine bas, görünen adını yaz ve dünyana bir ad ver.
2. Üst menüde **Davet** → **Bağlantıyı kopyala** seçeneğini kullan.
3. Bağlantıyı Ada'ya gönder; Ada bağlantıyı farklı bir tarayıcı/profilde açıp adını seçer.
4. Davet tek kullanımlıktır ve 24 saatte sona erer. Dünya iki üyeye ulaştığında yeni katılım kapanır.
5. Bir biyoma gir, **Çiz** ile türünü seç, çizimini adlandır ve sahnede yerini belirle.

> Anonim oturum tarayıcı verisi silinirse geri alınamaz. Profildeki **Hesabımı koru** akışı mevcut kullanıcı kimliğine e-posta ekler.

## Geliştirme

Node.js 24 kullanılır. `.env.example` dosyasını `.env.local` olarak kopyalayıp Supabase proje URL'si ile publishable key'i girin.

```bash
npm ci
npm run dev
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

Migration: `supabase/migrations/20261028195500_paperverse_initial.sql`. Bucket private'tır; `service_role` veya başka bir gizli anahtar istemciye girmez.

## Gizlilik ve sahiplik

- Dünya UUID'sini bilmek veri okumaya yetmez; üyelik RLS ile doğrulanır.
- Bir dünya en fazla iki üyedir ve her kullanıcı en fazla tek dünyaya üyedir.
- Davet sırrının yalnızca SHA-256 özeti saklanır; tekrar kullanım ve dolu dünya veritabanı transaction'ında reddedilir.
- Yalnızca çizim sahibi ad/konum/silme yapabilir. Sprite'lar private Storage bucket'tadır ve kısa ömürlü signed URL ile okunur.
- Kullanıcı metni HTML olarak enjekte edilmez; adlar istemci ve veritabanı katmanında sınırlandırılır.

Daha fazla ayrıntı için [ARCHITECTURE.md](ARCHITECTURE.md) ve [TEST_REPORT.md](TEST_REPORT.md) dosyalarına bakın.
