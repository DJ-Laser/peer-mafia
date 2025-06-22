import {
  type RouteConfig,
  index,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("host", "routes/host.tsx"),
  ...prefix("play", [
    index("routes/play/roomSelect.tsx"),
    route(":roomId", "routes/play/game.tsx"),
  ]),
  route("*", "routes/catchall.tsx"),
] satisfies RouteConfig;
