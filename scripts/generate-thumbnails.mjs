/**
 * Generate thumbnails for album photos.
 * 
 * Usage: node scripts/generate-thumbnails.mjs
 * 
 * - Scans public/img/album/ for all subdirectories
 * - Creates a thumb/ subdirectory inside each album folder
 * - Generates 300px-wide JPEG thumbnails at 60% quality
 * - Skips already-existing thumbnails (safe to re-run)
 */

import sharp from 'sharp'
import { readdir, mkdir, access } from 'fs/promises'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ALBUM_DIR = join(__dirname, '..', 'public', 'img', 'album')

const THUMB_WIDTH = 300
const THUMB_QUALITY = 60
const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif']

async function exists(path) {
  try { await access(path); return true } catch { return false }
}

async function processAlbum(albumPath, albumName) {
  const thumbDir = join(albumPath, 'thumb')
  await mkdir(thumbDir, { recursive: true })

  const files = await readdir(albumPath)
  const images = files.filter(f => IMAGE_EXTS.includes(extname(f).toLowerCase()) && f !== 'thumb')

  let created = 0, skipped = 0

  for (const file of images) {
    const srcPath = join(albumPath, file)
    const thumbPath = join(thumbDir, file)

    if (await exists(thumbPath)) {
      skipped++
      continue
    }

    try {
      await sharp(srcPath)
        .resize(THUMB_WIDTH, null, { withoutEnlargement: true })
        .jpeg({ quality: THUMB_QUALITY })
        .toFile(thumbPath)
      created++
    } catch (err) {
      console.error(`  ✗ ${file}: ${err.message}`)
    }
  }

  console.log(`  ${albumName}: ${created} created, ${skipped} skipped`)
}

async function main() {
  console.log('Generating thumbnails...\n')

  const entries = await readdir(ALBUM_DIR, { withFileTypes: true })
  const albums = entries.filter(e => e.isDirectory() && e.name !== 'thumb')

  for (const album of albums) {
    const albumPath = join(ALBUM_DIR, album.name)
    await processAlbum(albumPath, album.name)
  }

  console.log('\nDone!')
}

main().catch(console.error)
