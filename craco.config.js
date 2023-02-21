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

      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new ModuleFederationPlugin({
          name: "testViewer",
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

      return webpackConfig;
    },
  },
};
