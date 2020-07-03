const path = require("path");

const SWARMLET = "Swarmlet";
const SWARMLET_URL = "https://swarmlet.dev";
const SWARMLET_TAGLINE = "A self-hosted, open-source Platform as a Service";
const SWARMLET_KEYWORDS = [
  "swarmlet",
  "docker",
  "swarm",
  "cluster",
  "docker-compose",
  "git",
  "deployment",
  "push",
  "loadbalancing",
  "traefik",
  "metrics",
  "analytics",
  "self-hosted",
  "self",
  "hosted",
];

module.exports = {
  title: SWARMLET,
  tagline: SWARMLET_TAGLINE,
  organizationName: SWARMLET,
  url: SWARMLET_URL,
  baseUrl: "/",
  favicon: "favicon.ico",
  projectName: SWARMLET,
  scripts: [`${SWARMLET_URL}/matomo.js`, `${SWARMLET_URL}/player.js`],
  plugins: [
    // Community plugins
    "docusaurus-plugin-sass",
    [
      "@docusaurus/plugin-sitemap",
      {
        cacheTime: 600 * 1000, // 600 sec - cache purge period
        changefreq: "weekly",
        priority: 0.5,
      },
    ],
    // Custom plugins
    [
      path.resolve(__dirname, "plugins/inject-html-tags/src/index.js"),
      {
        headTags: [
          {
            tagName: "meta",
            attributes: {
              name: "description",
              content: SWARMLET_TAGLINE,
            },
          },
          {
            tagName: "meta",
            attributes: {
              name: "keywords",
              content: SWARMLET_KEYWORDS.join(" "),
            },
          },
          {
            tagName: "meta",
            attributes: {
              name: "robots",
              content: "index, follow",
            },
          },
          {
            tagName: "meta",
            attributes: {
              property: "og:url",
              content: SWARMLET_URL,
            },
          },
          {
            tagName: "meta",
            attributes: {
              property: "og:type",
              content: "website",
            },
          },
          {
            tagName: "meta",
            attributes: {
              property: "og:title",
              content: SWARMLET,
            },
          },
          {
            tagName: "meta",
            attributes: {
              property: "og:image",
              content: "img/og-image.png",
            },
          },
          {
            tagName: "meta",
            attributes: {
              property: "og:description",
              content: SWARMLET_TAGLINE,
            },
          },
          {
            tagName: "meta",
            attributes: {
              property: "og:title",
              content: SWARMLET,
            },
          },
          {
            tagName: "meta",
            attributes: {
              property: "og:site_name",
              content: SWARMLET,
            },
          },
        ],
      },
    ],
  ],
  themeConfig: {
    algolia: {
      apiKey: "e8dcc4acaf22c600f8e20738fb2b5915",
      indexName: "docs-staging",
      appId: "FAVSNXVQZ4",
    },
    navbar: {
      title: SWARMLET,
      logo: {
        alt: "Swarmlet Logo",
        src: "img/logo.png",
      },
      links: [
        {
          to: "docs/getting-started/introduction",
          activeBasePath: "docs",
          label: "Docs",
          position: "left",
        },
        {
          href: "https://github.com/swarmlet/swarmlet",
          label: "GitHub",
          position: "left",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Introduction",
              to: "docs/getting-started/introduction",
            },
            {
              label: "Installation",
              to: "docs/getting-started/installation",
            },
            {
              label: "Deploying applications",
              to: "docs/getting-started/deploying-applications",
            },
            {
              label: "Metrics and dashboards",
              to: "docs/getting-started/metrics-and-dashboards",
            },
          ],
        },
        {
          title: "Examples",
          items: [
            {
              label: "Static site",
              href: "docs/examples/static-site",
            },
            {
              label: "Python web server + Redis",
              href: "docs/examples/python-redis",
            },
            {
              label: "NGINX + React app + Node.js API",
              href: "docs/examples/nginx-react-node",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/swarmlet/swarmlet",
            },
            {
              label: "Stack Overflow",
              href: "https://stackoverflow.com/questions/tagged/swarmlet",
            },
          ],
        },
      ],
      copyright: `${SWARMLET} - ${new Date().getFullYear()}`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/swarmlet/swarmlet-website/edit/master/",
        },
        theme: {
          customCss: require.resolve("./src/scss/custom.scss"),
        },
      },
    ],
  ],
  themes: ["@docusaurus/theme-search-algolia"],
};
