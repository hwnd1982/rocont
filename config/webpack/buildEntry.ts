import path from "path";
import fs from "fs";
import webpack from "webpack";
import { WebpackBuildOptions } from "./types/config";

const buildEntry = (options: WebpackBuildOptions): webpack.Configuration["entry"] => {
    const { paths } = options;

    const entry = fs.readdirSync(paths.pages).reduce((acc, dir) => {
        acc.push([
            dir,
            {
                import: path.resolve(paths.pages, dir, "script.ts"),
                dependOn: dir === "base" ? undefined : "base",
            },
        ]);

        return acc;
    }, []);

    return Object.fromEntries(entry);
};

export { buildEntry };
