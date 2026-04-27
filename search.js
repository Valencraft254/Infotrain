export default async function handler(req, res) {

  const API_KEY = "FERRO_KEY_92837";
  const clientKey = req.headers["x-api-key"];

  if (clientKey !== API_KEY) {
    return res.status(403).json({ error: "No autorizado" });
  }

  const { q } = req.query;
  if (!q) return res.json({ results: [] });

  try {
    const page = await fetch("https://infotrain-dtgv.vercel.app/");
    const html = await page.text();

    // limpiar html
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .toLowerCase();

    // 🧠 dividir mejor (no solo puntos)
    let parts = text.split(/\.|\n/);

    // 🔎 palabras clave
    const keywords = q.toLowerCase().split(" ");

    // 🔥 buscar coincidencias reales
    let results = parts.filter(p => {
      return keywords.some(k => p.includes(k));
    });

    // ❗ si no encuentra → buscar por partes de palabra
    if (results.length === 0) {
      results = parts.filter(p => {
        return keywords.some(k => {
          return p.includes(k.slice(0, 4)); // ej: "mitr"
        });
      });
    }

    // 🎲 mezclar
    results = results.sort(() => 0.5 - Math.random());

    // ✂️ limitar
    results = results.slice(0, 5);

    res.json({ results });

  } catch (e) {
    res.json({ results: [] });
  }
}