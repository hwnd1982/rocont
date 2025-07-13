import path from "path";
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import { WebpackBuildOptions } from "./types/config";

const buildDevServer = (options: WebpackBuildOptions): DevServerConfiguration => {
    const { port, paths } = options;

    return {
        port,
        open: true,
        watchFiles: {
            paths: ["src/**/*.twig", "public/**/*"],
        },
        hot: "only",
    };
};

export { buildDevServer };
