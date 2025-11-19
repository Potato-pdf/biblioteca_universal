import { Hono } from "hono";
import { createRouteHandler } from "uploadthing/server";
import { uploadRouter } from "../config/uploadthing";

const uploadRouter_routes = new Hono();

// Crear los handlers de UploadThing
const handlers = createRouteHandler({
  router: uploadRouter,
  config: {
    token: process.env.UPLOADTHING_TOKEN,
  },
});

// Rutas de UploadThing (GET y POST requeridos)
uploadRouter_routes.get("/api/uploadthing", async (c) => {
  const request = c.req.raw;
  const response = await handlers.GET(request);
  return response;
});

uploadRouter_routes.post("/api/uploadthing", async (c) => {
  const request = c.req.raw;
  const response = await handlers.POST(request);
  return response;
});

export default uploadRouter_routes;
