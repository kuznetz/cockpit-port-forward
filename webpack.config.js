const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');
const outDir = path.resolve(__dirname, 'port-forward')

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development'
  
  const resolveAlias = {}
  if (isDevelopment) {
    resolveAlias['firewalld-api'] = path.resolve(__dirname, 'src/firewalld-api-mock.js');    
  } else {
    resolveAlias['firewalld-api'] = path.resolve(__dirname, 'src/firewalld-api.js');
  }

  let result = {
    mode: isDevelopment ? 'development' : 'production',
    entry: './src/index.js',
    output: {
      path: outDir,
      filename: 'port-forward.js'
    },
    resolve: {
      alias: resolveAlias,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react']
            }
          }
        },
        {
        test: /\.css$/, // Or /\.s[ac]ss$/ for Sass/SCSS
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            // "sass-loader" if using Sass/SCSS
          ],
        },
		/*
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
		*/
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'port-forward.css',
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public',    // source directory
            to: '.',           // destination in dist (root)
            globOptions: {
              //ignore: ['**/index.html'], // ignore specific files if needed
            },
            noErrorOnMissing: true, // don't error if directory doesn't exist
          },
        ],
      })
    ],
    externals: {
      cockpit: 'cockpit'
    }
  }

  if (isDevelopment) {
    result.devServer = {
        static: outDir, // Serve files from the 'dist' directory
        port: 8080, // Specify a port (default is 8080)
        open: true, // Open the browser automatically
        hot: true, // Enable Hot Module Replacement (HMR)
    }
  }

  return result
};