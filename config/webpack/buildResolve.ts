import { WebpackBuildOptions } from "./types/config";
import webpack from "webpack";
import path from "path";

const buildResolve = (options: WebpackBuildOptions): webpack.Configuration["resolve"] => {
    const { paths } = options;

    return {
        extensions: [".ts", ".js"],
        modules: [paths.src, "node_modules"],
        alias: {
            "@icons": path.resolve(paths.src, "shared", "icons"),
            "@styles": path.resolve(paths.src, "shared", "styles"),
            "@widgets": path.resolve(paths.src, "widgets"),
            "@shared": path.resolve(paths.src, "shared"),
            "@entities": path.resolve(paths.src, "entities"),
            "@features": path.resolve(paths.src, "features"),
            "@layouts": path.resolve(paths.src, "app", "layouts"),
            "@ui": path.resolve(paths.src, "shared", "ui"),
            "@lib": path.resolve(paths.src, "shared", "lib"),
            "@app": path.resolve(paths.src, "app"),
        },
    };
};

export { buildResolve };
