const path = require('path')

module.exports = [
  {
    name: 'main',
    entry: './src/main.ts',
    target: 'electron-main',
    mode: "production",
    node: { __dirname: false, __filename: true},
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist')
    }
  },
  {
    name: 'renderer',
    entry: './src/renderer.tsx',
    target: 'electron-renderer',
    mode: "production",
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        },
        {
          test: /\.(woff|woff2)$/,
          use: ["file-loader"]
        },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    output: {
      filename: 'renderer.js',
      path: path.resolve(__dirname, 'dist')
    }
  }]
