import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://algovisual-six.vercel.app",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://algovisual-six.vercel.app/visualize",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://algovisual-six.vercel.app/visualize/algorithms/bfs",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://algovisual-six.vercel.app/visualize/algorithms/dfs",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://algovisual-six.vercel.app/visualize/basics/for-loop",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://algovisual-six.vercel.app/visualize/basics/star-patterns",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://algovisual-six.vercel.app/visualize/basics/while-loop",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://algovisual-six.vercel.app/visualize/data-structures/array",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://algovisual-six.vercel.app/visualize/data-structures/binary-search-tree",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://algovisual-six.vercel.app/visualize/data-structures/circular-linked-list",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://algovisual-six.vercel.app/visualize/data-structures/circular-queue",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://algovisual-six.vercel.app/visualize/data-structures/double-ended-queue",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://algovisual-six.vercel.app/visualize/data-structures/doubly-linked-list",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://algovisual-six.vercel.app/visualize/data-structures/linear-queue",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://algovisual-six.vercel.app/visualize/data-structures/priority-queue",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://algovisual-six.vercel.app/visualize/data-structures/singly-linked-list",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://algovisual-six.vercel.app/visualize/data-structures/stack",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://algovisual-six.vercel.app/visualize/data-structures/undirected-graph",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://algovisual-six.vercel.app/visualize/searching/binary-search",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://algovisual-six.vercel.app/visualize/searching/linear-search",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://algovisual-six.vercel.app/visualize/sorting/bubble-sort",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://algovisual-six.vercel.app/visualize/sorting/heap-sort",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://algovisual-six.vercel.app/visualize/sorting/insertion-sort",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://algovisual-six.vercel.app/visualize/sorting/merge-sort",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://algovisual-six.vercel.app/visualize/sorting/quick-sort",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://algovisual-six.vercel.app/visualize/sorting/radix-sort",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://algovisual-six.vercel.app/visualize/sorting/selection-sort",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];
}
