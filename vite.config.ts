import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import handler from "./api/register.js";

function apiRegisterPlugin(): Plugin {
  return {
    name: "api-register-dev",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && (req.url === "/api/register" || req.url.startsWith("/api/register?"))) {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("end", async () => {
            try {
              const fakeReq = {
                method: req.method,
                url: req.url,
                body: body ? JSON.parse(body) : {},
                headers: req.headers,
              };
              const fakeRes = {
                statusCode: 200,
                headers: {},
                setHeader(name: string, value: string) {
                  this.headers[name] = value;
                  res.setHeader(name, value);
                },
                status(code: number) {
                  this.statusCode = code;
                  res.statusCode = code;
                  return this;
                },
                json(data: any) {
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify(data));
                  return this;
                },
                end() {
                  res.end();
                  return this;
                },
              };
              await handler(fakeReq, fakeRes);
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), apiRegisterPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    port: 4001,
    strictPort: false,
    host: "0.0.0.0",
  },
  preview: {
    port: 4001,
    host: "0.0.0.0",
  },
});

