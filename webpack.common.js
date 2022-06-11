const { sources } = require("webpack");
const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

// css minification plugin has been included here
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");


module.exports = {
  entry: {
    index: "./src/js/index.js",
  },

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "docs"),
    assetModuleFilename: "images/[name][ext][query]",
    clean: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: "body",

      // for favicon
      favicon: "./src/icons/favicon.ico"
    }),

    new MiniCssExtractPlugin({
      filename: "[name].bundle.css",
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(svg|woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          //filename: 'fonts/[name]-[hash][ext][query]'
          filename: "fonts/[name][ext][query]",
        },
      },

      {
        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
        type: "asset/resource",

        // rules for optimizing photo
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                //quality: 65,
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75
              }
            }
          },
        ],
      },


      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader, // inject CSS to the DOM and extract on a separate file.
          "css-loader", // translates CSS into CommonJS modules
          "postcss-loader", // Run postcss actions
          "sass-loader", // compiles Sass to CSS
        ],
      },

      {
        test: /\.html$/i,
        loader: "html-loader",
      },

      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },

  cache: {
    type: "filesystem",
  },
};