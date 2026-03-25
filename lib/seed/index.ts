import type { SQLiteDatabase } from 'expo-sqlite';
import { MEDICAL_PACK, MEDICAL_ARTICLES } from './medicalPack';
import { SURVIVAL_PACK, SURVIVAL_ARTICLES } from './survivalPack';

const ALL_PACKS = [MEDICAL_PACK, SURVIVAL_PACK];

const ARTICLES_BY_PACK: Record<string, typeof MEDICAL_ARTICLES> = {
  medical: MEDICAL_ARTICLES,
  survival: SURVIVAL_ARTICLES,
};

async function insertPack(
  db: SQLiteDatabase,
  pack: typeof MEDICAL_PACK
): Promise<void> {
  await db.runAsync(
    `INSERT OR IGNORE INTO packs (id, name, description, category, size_bytes, version, is_required, is_installed, installed_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      pack.id,
      pack.name,
      pack.description,
      pack.category,
      pack.sizeBytes,
      pack.version,
      pack.isRequired ? 1 : 0,
      pack.isRequired ? 1 : 0, // required packs are auto-installed
      pack.isRequired ? Date.now() : null,
    ]
  );
}

export async function seedPackArticles(
  db: SQLiteDatabase,
  packId: string
): Promise<void> {
  const articles = ARTICLES_BY_PACK[packId];
  if (!articles) return;

  for (const article of articles) {
    await db.runAsync(
      `INSERT OR IGNORE INTO articles (id, pack_id, title, content, category, tags, is_critical, read_time, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        article.id,
        article.packId,
        article.title,
        article.content,
        article.category,
        article.tags,
        article.isCritical ? 1 : 0,
        article.readTime,
        Date.now(),
      ]
    );
  }
}

export async function seedDatabase(db: SQLiteDatabase): Promise<void> {
  for (const pack of ALL_PACKS) {
    await insertPack(db, pack);
  }
  // Auto-seed articles for required (pre-installed) packs
  for (const pack of ALL_PACKS) {
    if (pack.isRequired) {
      await seedPackArticles(db, pack.id);
    }
  }
}
