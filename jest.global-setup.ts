// Tüm testler aynı saat diliminde koşsun diye: DST (yaz saati) olan bir dilim seçildi,
// çünkü Türkiye'de (UTC+3, DST yok) DST regresyonları yakalanamaz.
const TEST_TIME_ZONE = "America/New_York";

export default async function globalSetup() {
  process.env.TZ = TEST_TIME_ZONE;
}
