import path from 'node:path';
import fs from 'node:fs/promises';

export type Project = {
  slug: string;
  title: string;
  excerpt?: string;
  cover?: string | { src: string };
  tags?: string[];
  description?: string;
  images?: Array<string | { src: string; alt?: string; width?: number; height?: number }>;
};

const DATA_PATH = path.join(process.cwd(), 'src', 'lib', 'projects.data.json');

async function readAll(): Promise<Project[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    // no file yet → empty
    return [];
  }
}

export async function getAllProjects(): Promise<Project[]> {
  return await readAll();
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const all = await readAll();
  return all.find((p) => p.slug === slug);
}
