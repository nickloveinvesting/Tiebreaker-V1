import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API constraints
  const WATCH_PROVIDERS = [
    8, // Netflix
    15, // Hulu
    384, // HBO Max
    337 // Disney+
  ].join('|');

  // API Routes
  app.get("/api/places/nearby", async (req, res) => {
    try {
      const { lat, lng } = req.query;
      const apiKey = process.env.GOOGLE_MAPS_PLATFORM_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ error: "Missing GOOGLE_MAPS_PLATFORM_KEY" });
      }

      if (!lat || !lng) {
        return res.status(400).json({ error: "Missing lat/lng" });
      }

      const body = {
        includedTypes: ["restaurant"],
        maxResultCount: 20,
        locationRestriction: {
          circle: {
            center: { latitude: Number(lat), longitude: Number(lng) },
            radius: 5000.0 // 5km
          }
        }
      };

      const response = await fetch("https://places.googleapis.com/v1/places:searchNearby", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "places.id,places.displayName,places.primaryTypeDisplayName"
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
         const err = await response.json();
         throw new Error(err.error?.message || "Places API failed");
      }

      const data = await response.json();
      
      const results = (data.places || []).map((p: any) => ({
        id: p.id,
        name: p.displayName?.text,
        emoji: '🍽️',
        cuisine: p.primaryTypeDisplayName?.text || 'Restaurant',
        mode: 'out',
        active: true
      }));

      res.json(results);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || "Failed to fetch places" });
    }
  });

  app.get("/api/tmdb/trending", async (req, res) => {
    try {
      const apiKey = process.env.TMDB_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Missing TMDB_API_KEY" });
      }
      
      // Discover movies available on requested streaming platforms in US
      const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_watch_providers=${WATCH_PROVIDERS}&watch_region=US&sort_by=popularity.desc&page=1`, {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "accept": "application/json"
        }
      });
      // Note TMDB also supports API keys via query param if Bearer token isn't the API key format they are using (v3 vs v4).
      // We will try Bearer, if not query param fallback handled below.
      let data = await response.json();
      
      if (!response.ok && data.status_code === 7) {
        // Fallback to query param
         const fallbackRes = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_watch_providers=${WATCH_PROVIDERS}&watch_region=US&sort_by=popularity.desc&page=1`);
         data = await fallbackRes.json();
         if (!fallbackRes.ok) throw new Error(data.status_message || "TMDB API failed");
      } else if (!response.ok) {
         throw new Error(data.status_message || "TMDB API failed");
      }

      const results = (data.results || []).map((r: any) => ({
        id: `movie_${r.id}`,
        title: r.title,
        type: 'movie',
        posterUrl: `https://image.tmdb.org/t/p/w200${r.poster_path}`,
        active: true
      }));

      res.json(results);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || "Failed to fetch movies" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
