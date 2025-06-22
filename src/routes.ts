import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/host", "routes/host.tsx"),
  route("/play/:roomId", "routes/play.tsx"),
  route("*", "routes/catchall.tsx"),
] satisfies RouteConfig;
