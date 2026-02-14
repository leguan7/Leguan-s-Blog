import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imgDir = path.join(__dirname, '..', 'public', 'img');
const outputDir = path.join(__dirname, '..', 'public', 'img-optimized');

// 创建输出目录
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 获取所有图片文件
const files = fs.readdirSync(imgDir).filter(file => 
  /\.(jpg|jpeg|png|webp)$/i.test(file) && !fs.statSync(path.join(imgDir, file)).isDirectory()
);

console.log(`找到 ${files.length} 个图片文件`);

// 压缩配置
const MAX_WIDTH = 1920;  // 最大宽度
const QUALITY = 80;      // JPEG 质量

async function compressImage(filename) {
  const inputPath = path.join(imgDir, filename);
  const outputPath = path.join(outputDir, filename);
  
  const stats = fs.statSync(inputPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  
  console.log(`处理 ${filename} (${sizeMB}MB)...`);
  
  try {
    // 先读取整个文件到内存
    const inputBuffer = fs.readFileSync(inputPath);
    const image = sharp(inputBuffer);
    const metadata = await image.metadata();
    
    // 计算新尺寸
    let width = metadata.width;
    if (width > MAX_WIDTH) {
      width = MAX_WIDTH;
    }
    
    // 压缩图片
    const ext = path.extname(filename).toLowerCase();
    let outputBuffer;
    
    if (ext === '.png') {
      outputBuffer = await sharp(inputBuffer)
        .resize(width, null, { withoutEnlargement: true })
        .png({ quality: QUALITY, compressionLevel: 9 })
        .toBuffer();
    } else {
      outputBuffer = await sharp(inputBuffer)
        .resize(width, null, { withoutEnlargement: true })
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toBuffer();
    }
    
    // 写入到新目录
    fs.writeFileSync(outputPath, outputBuffer);
    
    const newStats = fs.statSync(outputPath);
    const newSizeMB = (newStats.size / (1024 * 1024)).toFixed(2);
    const reduction = ((1 - newStats.size / stats.size) * 100).toFixed(1);
    
    console.log(`  ✓ ${sizeMB}MB -> ${newSizeMB}MB (减少 ${reduction}%)`);
  } catch (err) {
    console.error(`  ✗ 处理 ${filename} 失败:`, err.message);
  }
}

async function main() {
  console.log('开始压缩图片...');
  console.log(`输出目录: ${outputDir}\n`);
  
  for (const file of files) {
    await compressImage(file);
  }
  
  console.log('\n压缩完成！');
  console.log('压缩后的图片在 public/img-optimized 目录');
  console.log('\n请手动执行以下步骤来替换原图片:');
  console.log('1. 停止开发服务器');
  console.log('2. 备份 public/img 目录');
  console.log('3. 将 public/img-optimized 中的文件复制到 public/img');
}

main();
