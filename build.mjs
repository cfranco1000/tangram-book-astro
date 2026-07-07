import { spawnSync } from 'child_process';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';

// Step 1: Run Astro build
spawnSync('npm', ['run', 'build:astro'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  shell: true,
  windowsHide: true,
});
// Exit code is unreliable on Windows (npm batch file bug).
// Validate by checking that dist/index.html was generated.
const indexHtml = join(process.cwd(), 'dist', 'index.html');
if (!existsSync(indexHtml)) {
  console.error('Build failed: dist/index.html not found');
  process.exit(1);
}

// Step 2: Inline CSS in output HTML
const root = process.cwd();
for (const dir of [join(root, 'dist'), join(root, '.vercel', 'output', 'static')]) {
  if (!existsSync(dir)) continue;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) continue;
    if (entry.name.endsWith('.html')) {
      let html = readFileSync(full, 'utf-8');
      html = html.replace(
        /<link rel="stylesheet" href="([^"]+\.css)"[^>]*>/g,
        (_, href) => {
          const cssPath = join(dirname(full), href);
          try {
            return `<style>${readFileSync(cssPath, 'utf-8')}</style>`;
          } catch {
            return _;
          }
        }
      );
      writeFileSync(full, html, 'utf-8');
      console.log('  inlined CSS into', full);
    }
  }
}
console.log('Build complete!');
