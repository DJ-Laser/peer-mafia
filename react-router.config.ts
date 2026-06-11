import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
  basename: "/peer-mafia/",
  ssr: false,

  future: {
    v8_middleware: true,
    v8_splitRouteModules: "enforce",
    v8_viteEnvironmentApi: true,
    v8_passThroughRequests: true,
    v8_trailingSlashAwareDataRequests: true,
  },
} satisfies Config;
