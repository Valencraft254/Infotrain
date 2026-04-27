export default async function handler(req, res) {

  // 🔐 TU API KEY (podés cambiarla)
  const API_KEY = "FERRO_KEY_92837";

  const clientKey = req.headers["x-api-key"];

  // ❌ bloquear si no tiene key
  if (clientKey !== API_KEY) {
    return res.status(403).json({ error: "No autorizado" });
  }

  const { q } = req.query;

  if (!q) {
    return res.json({ results: [] });
  }

  try {
    // 🌐 leer tu web
    const page = await fetch("https://infotrain-dtgv.vercel.app/");
    const html = await page.text();

    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .toLowerCase();

    // 🧠 dividir texto
    let parts = text.split(". ");

    // 🔎 búsqueda inteligente
    const keywords = q.toLowerCase().split(" ");

    let results = parts.filter(p =>
      keywords.some(k => p.includes(k))
    );

    // 🎲 RANDOM (mezcla resultados)
    results = results.sort(() => 0.5 - Math.random());

    // limitar
    results = results.slice(0, 5);

    res.json({ results });

  } catch (e) {
    res.json({ results: [] });
  }
}