const path = require("path")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

const outputPath = path.resolve(__dirname, "html")

module.exports = {
  plugins: [
    new FixStyleOnlyEntriesPlugin({
      extensions: ["less", "scss", "css", "styl", "sass", "html"],
    }),
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin(),
  ],
  entry: {
    "assets/css/style": path.resolve(__dirname, "src/scss/style.scss"),
    "assets/js/app": "./src/js/app.js",
    index: "./src/index.html",
  },
  output: {
    path: outputPath,
  },
  devServer: {
    contentBase: path.join(__dirname, "html"),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        oneOf: [
          {
            test: /\.(gif|png|jpe?g|svg)$/i,
            resourceQuery: /lazyload/,
            use: [
              {
                loader: "@mmooccii/lazyload-loader",
                options: {
                  name: "assets/images/blur/[name].[ext]",
                  publicPath: (url, resourcePath, context) => {
                    if (/s?css\/images/i.test(resourcePath)) {
                      return url.replace(/^assets/i, "..")
                    }
                    return url
                  },
                },
              },
            ],
          },
          {
            test: /\.(gif|png|jpe?g|svg)$/i,
            use: [
              {
                loader: "file-loader",
                options: {
                  name: "assets/images/[name].[ext]",
                  publicPath: (url, resourcePath, context) => {
                    if (/s?css\/images/i.test(resourcePath)) {
                      return url.replace(/^assets/i, "..")
                    }
                    return url
                  },
                },
              },
            ],
          },
        ],
      },
      {
        test: /\.html$/i,
        type: "asset/resource",
        generator: {
          filename: "[name][ext]",
        },
      },
      {
        test: /\.html$/i,
        use: [
          {
            loader: "extract-loader",
          },
          {
            loader: "html-loader",
            options: {
              esModule: false,
              sources: {
                list: [
                  "...",
                  {
                    tag: "img",
                    attribute: "data-src",
                    type: "src",
                  },
                ],
                urlFilter: (attribute, value, resourcePath) => {
                  if (/\.(ico|css|js)$/.test(value)) {
                    return false
                  }
                  return true
                },
              },
            },
          },
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      filename: "assets/js/[name].js",
      cacheGroups: {
        vendors: {
          test(module, chunks) {
            return module.resource && /node_modules\//i.test(module.resource)
          },
          name: "vendor",
          chunks: "async",
          enforce: true,
        },
      },
    },
  },
}
