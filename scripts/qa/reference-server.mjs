import http from "node:http";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const html = new Set((await readdir(root)).filter(name => name.endsWith(".html")));
const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".avif": "image/avif", ".gif": "image/gif", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".woff": "font/woff", ".mp4": "video/mp4", ".webm": "video/webm" };
http.createServer(async (request, response) => {
  try {
    const route = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname).replace(/^\/+/, "") || "index.html";
    const allowed = html.has(route) || route.startsWith("assets/") || (/^src\/(css|js)\//.test(route) && /\.(css|js)$/.test(route));
    const filename = path.resolve(root, route);
    const relative = path.relative(root, filename);
    if (!allowed || relative.startsWith("..") || path.isAbsolute(relative)) throw new Error("not allowed");
    const bytes = await readFile(filename);
    response.writeHead(200, { "Content-Type": mime[path.extname(filename).toLowerCase()] ?? "application/octet-stream", "Cache-Control": "no-store" });
    response.end(bytes);
  } catch { response.writeHead(404); response.end("Not found"); }
}).listen(4179, "127.0.0.1", () => console.log("Original reference: http://127.0.0.1:4179"));
