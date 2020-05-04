module.exports = {
  title: "Swarmlet",
  tagline: "A self-hosted, open-source Platform as a Service",
  url: "https://swarmlet.dev",
  baseUrl: "/",
  favicon: "favicon.ico",
  projectName: "swarmlet",
  scripts: [
    'https://swarmlet.dev/matomo.js',
    'https://swarmlet.dev/player.js'
  ],
  themeConfig: {
    navbar: {
      title: "Swarmlet",
      logo: {
        alt: "Swarmlet Logo",
        src: "img/logo.png"
      },
      links: [
        {
          to: "docs/getting-started/introduction",
          activeBasePath: "docs",
          label: "Docs",
          position: "left"
        },
        {
          href: "https://github.com/swarmlet/swarmlet",
          label: "GitHub",
          position: "left"
        }
      ]
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Introduction",
              to: "docs/getting-started/introduction"
            },
            {
              label: "Installation",
              to: "docs/getting-started/installation"
            },
            {
              label: "Deploying applications",
              to: "docs/getting-started/deploying-applications"
            },
            {
              label: "Metrics and dashboards",
              to: "docs/getting-started/metrics-and-dashboards"
            }
          ]
        },
        {
          title: "Examples",
          items: [
            {
              label: "Static site",
              href: "docs/examples/static-site"
            },
            {
              label: "Python web server + Redis",
              href: "docs/examples/python-redis"
            },
            {
              label: "NGINX + React app + Node.js API",
              href: "docs/examples/nginx-react-node"
            }
          ]
        },
        {
          title: "Community",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/swarmlet/swarmlet"
            },
            {
              label: "Stack Overflow",
              href: "https://stackoverflow.com/questions/tagged/swarmlet"
            }
          ]
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Swarmlet.`
    }
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/swarmlet/swarmlet-website/edit/master/"
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css")
        }
      }
    ]
  ]
};

