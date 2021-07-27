const path = require("path")
const RemoveEmptyScriptsPlugin = require("webpack-remove-empty-scripts")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

const outputPath = path.resolve(__dirname, "html")

module.exports = {
  plugins: [
    new RemoveEmptyScriptsPlugin({ extensions: ["html", "scss"] }),
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin(),
  ],
  resolve: {
    modules: ["node_modules", path.resolve(__dirname, "src", "js")],
  },
  entry: {
    "assets/css/style": "./src/scss/style.scss",
    "assets/css/footer": "./src/scss/footer.scss",
    "assets/js/app": "./src/js/app.js",
    index: "./src/index.html",
  },
  output: {
    path: outputPath,
  },
  devServer: {
    host: "0.0.0.0",
    contentBase: path.join(__dirname, "html"),
    hot: false,
    liveReload: false,
    compress: true,
  },
  externals: {
    gsap: "gsap",
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "entry",
                  corejs: "3",
                },
              ],
              "@babel/preset-react",
            ],
            plugins: ["@babel/plugin-syntax-dynamic-import"],
          },
        },
      },
      {
        test: /\.mp3$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/media/[name][ext]",
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
            test: /\.svg$/i,
            resourceQuery: /inline/,
            use: [
              {
                loader: "svg-inline-loader",
              },
            ],
          },
          {
            test: /\.svg$/i,
            resourceQuery: /url/,
            use: [
              {
                loader: "svg-url-loader",
                options: {
                  iesafe: true,
                },
              },
            ],
          },
          {
            test: /\.(gif|png|jpe?g|svg)$/i,
            resourceQuery: /lazyloadsass/,
            use: [
              {
                loader: "@mmooccii/lazyload-loader",
                options: {
                  name: "assets/images/blur/[name].[ext]",
                  publicPath: (url, resourcePath, context) => {
                    return url.replace(/^assets/i, "..")
                  },
                },
              },
            ],
          },
          {
            test: /\.(gif|png|jpe?g|svg)$/i,
            resourceQuery: /lazyload/,
            use: [
              {
                loader: "@mmooccii/lazyload-loader",
                options: {
                  name: "assets/images/blur/[name].[ext]",
                  publicPath: (url, resourcePath, context) => {
                    return url
                  },
                },
              },
            ],
          },
          {
            test: /\.(gif|png|jpe?g|svg)$/i,
            type: "asset/resource",
            resourceQuery: /css/,
            generator: {
              filename: "assets/images/[name].[ext]",
              publicPath: "../../",
            },
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
                  {
                    attribute: "data-bg",
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
        lodash: {
          test: /lodash/,
          name: "lodash",
          chunks: "all",
        },
        gsap: {
          test: /gsap/,
          name: "gsap",
          chunks: "all",
        },
      },
    },
  },
}
