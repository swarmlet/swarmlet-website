module.exports = {
  sidebar: {
    "Getting Started": [
      "getting-started/introduction",
      "getting-started/installation",
      "getting-started/ssh-key-setup",
      "getting-started/deploying-applications",
      "getting-started/swarm-registry",
      "getting-started/environment-variables",
      "getting-started/secrets-and-configs",
      "getting-started/modules-configuration",
      "getting-started/domain-configuration",
      "getting-started/automatic-ssl-and-load-balancing",
      "getting-started/metrics-and-dashboards",
    ],
    "App Deployment": [
      "app-deployment/deploying-apps",
      "app-deployment/deployment-labels",
      "app-deployment/ci-cd",
      "app-deployment/custom-registry",
    ],
    "Persistent Storage": [
      "persistent-storage/using-storage",
      "persistent-storage/glusterfs",
    ],
    "Swarm Managment": [
      "swarm-management/managing-swarm-nodes",
      "swarm-management/using-ansible"
    ],
    // Services: [],
    // Configuration: [],
    // Networking: [],
    // Development: [],
    // CLI: ["cli/commands"],
    Examples: [
      {
        type: "link",
        label: "GitHub",
        href: "https://github.com/swarmlet/swarmlet/tree/master/examples",
      },
    ],
  },
};
