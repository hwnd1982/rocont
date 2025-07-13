module.exports = {
  multipass: true,
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          inlineStyles: {
            onlyMatchedOnce: false,
          },
          removeViewBox: false,
        },
      },
    },
    {
      name: "convertStyleToAttrs",
    },
    {
      name: "removeAttrs",
      params: {
        attrs: ["fill"],
      },
    },
  ],
};
