const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;

module.exports = {
  devServer: {
    port: 3001
  },
  webpack: {
    reactScriptsVersion: "@bentley/react-scripts" /* (default value) */,
    eslint: {
      enable: false
    },
    plugins: {
      remove: ["ModuleScopePlugin"],
    },
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.output.publicPath = "auto";

      const htmlWebpackPlugin = webpackConfig.plugins.find((plugin) => plugin.constructor.name === "HtmlWebpackPlugin");

      htmlWebpackPlugin.userOptions = {
        ...htmlWebpackPlugin.userOptions,
        publicPath: paths.publicUrlOrPath,
      };

      webpackConfig.resolve.fallback = webpackConfig.resolve.fallback || {}
      webpackConfig.resolve.fallback.process = require.resolve('process/browser')

      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new ModuleFederationPlugin({
          name: "testViewer",
          // remotes: {
          //   app2: "app1@http://localhost:3000/remoteEntry.js",
          // },
          filename: "remoteEntry.js",
          exposes: {
            "./Viewer": "./src/ViewerWrapper",
          },
          shared: [
            {
              // ...deps,
              react: {
                singleton: true,
                requiredVersion: deps["react"],
              },
              "react-dom": {
                singleton: true,
                requiredVersion: deps["react-dom"],
              },
              "@itwin/itwinui-react": {
                singleton: true,
                requiredVersion: deps["@itwin/itwinui-react"],
              },
              "@itwin/itwinui-layouts-react": {
                singleton: true,
                requiredVersion: deps["@itwin/itwinui-layouts-react"],
              },
            },
          ],
        }),
      ];

      // webpackConfig.optimization = {
      //   ...webpackConfig.optimization,
      //   splitChunks: false,
      // };

      return webpackConfig;
    },
  },
};
