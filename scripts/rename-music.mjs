import { readdirSync, renameSync } from 'fs'
import { join } from 'path'

const dir = 'public/music'
const files = readdirSync(dir)

for (const f of files) {
  if (!f.endsWith('.mp3')) continue
  // Replace commas, tildes, and any quotes with hyphen or nothing
  let newName = f
    .replace(/[,，]/g, ' ')       // commas → space
    .replace(/~/g, '-')           // tilde → hyphen
    .replace(/[\u201c\u201d\u2018\u2019"']/g, '') // quotes → remove
    .replace(/\s{2,}/g, ' ')     // collapse multiple spaces
    .trim()

  if (newName !== f) {
    renameSync(join(dir, f), join(dir, newName))
    console.log(`${f}\n  -> ${newName}\n`)
  }
}

console.log('Done')
