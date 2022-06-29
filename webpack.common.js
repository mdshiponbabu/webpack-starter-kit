const { sources } = require("webpack"); //for webpack
const path = require("path"); //for path
const HtmlWebpackPlugin = require("html-webpack-plugin"); //for html
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //for css extract
const FaviconsWebpackPlugin = require('favicons-webpack-plugin'); //for favicon

module.exports = {
  entry: {
    index: "./src/js/index.js",
    about: "./src/js/about.js"
  },

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "docs"),
    assetModuleFilename: "images/[name][ext][query]",
    clean: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      // // set title for this page
      // title: "",
      // // set filename for this page
      // filename: "",

      template: "./src/index.html",
      inject: "body",
      chunks: ["index"],

      // // it work only for single page website 
      // favicon: "./src/icons/favicon.ico"
    }),

    new HtmlWebpackPlugin({
      filename: "about.html",
      template: "./src/about.html",
      inject: "body",
      chunks: ["about"],
    }),

    new MiniCssExtractPlugin({
      filename: "[name].bundle.css",
    }),

    // The default configuration will automatically generate all needed setup 
    new FaviconsWebpackPlugin('./src/icons/logo.png') // svg works too!
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
            loader: "image-webpack-loader",
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
                quality: [0.65, 0.9],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75,
              },
            },
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
