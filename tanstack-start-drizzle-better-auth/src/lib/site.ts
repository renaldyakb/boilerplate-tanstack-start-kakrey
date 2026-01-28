export const siteConfig = {
  name: "Tanstack+Kakrey",
  description: "Boilerplate modern web development dengan TanStack Stack",
  url: "https://example.com",
  ogImage: "https://example.com/og.jpg",
  links: {
    twitter: "https://twitter.com/kakrey",
    github: "https://github.com/renaldyakb",
  },
} as const;

export type SiteConfig = typeof siteConfig;
