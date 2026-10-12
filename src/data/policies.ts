// Policies from brand/policies/ (one Markdown file each). The page and footer read them from here.
import type { MarkdownInstance } from 'astro';

interface PolicyFrontmatter {
  title: string;
  description: string;
  status: 'draft' | 'approved';
  updated: string;
}

export interface Policy {
  slug: string;
  title: string;
  description: string;
  status: PolicyFrontmatter['status'];
  updated: string;
  Content: MarkdownInstance<PolicyFrontmatter>['Content'];
}

const files = import.meta.glob<MarkdownInstance<PolicyFrontmatter>>('../../brand/policies/*.md', { eager: true });

/** Display order in the footer. */
const order = ['shipping', 'returns', 'privacy', 'terms'];

export const policies: Policy[] = order.map((slug) => {
  const file = files[`../../brand/policies/${slug}.md`];
  if (!file) throw new Error(`Missing policy brand/policies/${slug}.md.`);
  const { title, description, status, updated } = file.frontmatter;
  return { slug, title, description, status, updated, Content: file.Content };
});

export const policyHref = (slug: string) => `/policies/${slug}`;
