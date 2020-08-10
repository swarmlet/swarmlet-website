module.exports = (context, { headTags }) => ({
  name: "swarmlet-inject-html-tags",
  injectHtmlTags() {
    return {
      headTags: headTags.map(({ tagName, attributes }) => ({
        tagName,
        attributes,
      })),
    };
  },
});
