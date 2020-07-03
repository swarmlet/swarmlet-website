module.exports = (context, { headTags }) => ({
  name: "swarmlet-inject-html-tags",
  injectHtmlTags() {
    return {
      headTags: headTags.map(({ tagName, attributes }) => ({
        tagName,
        attributes,
      })),
      // preBodyTags: [
      //   {
      //     tagName: 'script',
      //     attributes: {
      //       charset: 'utf-8',
      //       src: '/noflash.js',
      //     },
      //   },
      // ],
      // postBodyTags: [`<div> This is post body </div>`],
    };
  },
});
