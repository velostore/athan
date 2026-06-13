import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";
import { getRouterManifest } from "@tanstack/react-start/router-manifest";
import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "./router";

const queryClient = new QueryClient();

export default createStartHandler({
  createRouter: () => createRouter(queryClient),
  getRouterManifest,
})(defaultStreamHandler);
