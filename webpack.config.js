const path = require('path');
const fs = require('fs');
const nodeExternals = require('webpack-node-externals');

if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist');
}

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
delete packageJson['devDependencies'];
delete packageJson['scripts'];
fs.writeFileSync('./dist/package.json', JSON.stringify(packageJson, null, 2));

module.exports = {
  mode: 'production',
  target: 'node',
  entry: './src/main.ts',
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  externalsPresets: {
    node: true // in order to ignore built-in modules like path, fs, etc. 
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'nightwing.js',
    path: path.resolve(__dirname, 'dist'),
  },
};