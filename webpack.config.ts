import path from "path";
import webpack from "webpack";

import { WebpackBuildEnv, WebpackBuildPaths } from "./config/webpack/types/config";
import { buildWebpackConfig } from "./config/webpack/buildWebpackConfig";

const config = (env: WebpackBuildEnv): webpack.Configuration => {
    const mode = env.mode;
    const port = env.port || 3000;
    const isDev = mode === "development";

    const paths: WebpackBuildPaths = {
        src: path.resolve(__dirname, "src"),
        output: path.resolve(__dirname, "build"),
        pages: path.resolve(__dirname, "src", "app", "pages"),
        svgo: path.resolve(__dirname, "config", "svgo", "svgo.config.js"),
        public: path.resolve(__dirname, "public"),
    };

    return buildWebpackConfig({
        isDev,
        mode,
        port,
        paths,
    });
};

export default config;
