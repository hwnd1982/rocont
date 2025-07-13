import webpack from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { WebpackBuildOptions } from "./types/config";
import SvgChunkWebpackPlugin from "svg-chunk-webpack-plugin";
import path from "path";
// import { LoaderContext } from "mini-css-extract-plugin/types/utils";

const buildLoaders = (options: WebpackBuildOptions): webpack.Configuration["module"]["rules"] => {
    const { isDev, paths } = options;

    const tsLoader = {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
    };

    const twigLoader: webpack.RuleSetRule = {
        test: /\.twig$/,
        use: [
            {
                loader: "twigjs-loader",
            },
        ],
    };

    const styleLoader = {
        test: /\.s?[ac]ss$/i,
        use: [
            isDev ? "style-loader" : MiniCssExtractPlugin.loader,
            {
                loader: "css-loader",
                options: {
                    url: {
                        filter: (url: string) => !/\/fonts\//.test(url),
                    },
                },
            },
            {
                loader: "postcss-loader",
            },
            {
                loader: "sass-loader",
                options: {
                    sourceMap: isDev,
                    additionalData: `@use "@styles/mixins" as *; @use "@styles/variables" as *;`,
                    sassOptions: {
                        outputStyle: "compressed",
                    },
                },
            },
        ],
    };

    const svgIconsLoader = {
        test: /\.svg$/i,
        include: path.resolve(paths.src, "shared/icons"),
        use: [
            {
                loader: (SvgChunkWebpackPlugin as any).loader,
                options: {
                    configFile: paths.svgo,
                },
            },
        ],
    };

    const svgImagesLoader = {
        test: /\.svg$/i,
        exclude: path.resolve(paths.src, "shared/icons"),
        type: "asset/resource",
        generator: {
            filename: "assets/images/[name][ext][query]"
        }
    };

    const assetsLoader = {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: "asset/resource",
    };

    const loaders: webpack.Configuration["module"]["rules"] = [
        assetsLoader,
        svgIconsLoader,
        svgImagesLoader,
        twigLoader,
        styleLoader,
        tsLoader,
    ];

    return loaders;
};

export { buildLoaders };
