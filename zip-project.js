/**
 * Project Packaging Utility for C-Code Optimizer and Analyzer
 * Packages the clean project source code into a ZIP file (excluding node_modules, dist, etc.).
 * Works cross-platform on Windows using native PowerShell Compress-Archive.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = __dirname;
const TEMP_DIR = path.join(PROJECT_ROOT, 'temp_archive');
const ZIP_NAME = 'C-Code-Optimizer-Analyzer.zip';
const ZIP_PATH = path.join(PROJECT_ROOT, ZIP_NAME);

// Folders and files to include
const INCLUDES = [
  'backend',
  'frontend',
  'samples',
  'Dockerfile.backend',
  'Dockerfile.frontend',
  'docker-compose.yml',
  'README.md',
  'INSTALL.md',
  'zip-project.js'
];

// Paths to ignore during copy
const IGNORES = [
  'node_modules',
  'dist',
  '.git',
  '.DS_Store',
  'temp_archive',
  ZIP_NAME
];

function deleteFolderRecursive(directoryPath) {
  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach((file) => {
      const curPath = path.join(directoryPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(directoryPath);
  }
}

function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  const isDirectory = stats.isDirectory();
  const baseName = path.basename(src);

  // Check ignores
  if (IGNORES.includes(baseName)) {
    return;
  }

  if (isDirectory) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((child) => {
      copyRecursive(path.join(src, child), path.join(dest, child));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('Packaging C-Code Optimizer and Analyzer project...');

try {
  // 1. Clean previous runs
  if (fs.existsSync(ZIP_PATH)) {
    console.log(`Removing existing ${ZIP_NAME}...`);
    fs.unlinkSync(ZIP_PATH);
  }
  if (fs.existsSync(TEMP_DIR)) {
    deleteFolderRecursive(TEMP_DIR);
  }

  // 2. Create clean temporary staging directory
  fs.mkdirSync(TEMP_DIR, { recursive: true });

  // 3. Copy files to staging area
  console.log('Staging clean project files...');
  INCLUDES.forEach(item => {
    const srcPath = path.join(PROJECT_ROOT, item);
    const destPath = path.join(TEMP_DIR, item);
    if (fs.existsSync(srcPath)) {
      copyRecursive(srcPath, destPath);
    }
  });

  // 4. Compress the staging area using native OS command
  console.log('Compressing files to ZIP archive...');
  if (process.platform === 'win32') {
    // Windows PowerShell Compress-Archive
    execSync(`powershell.exe -Command "Compress-Archive -Path '${TEMP_DIR}\\*' -DestinationPath '${ZIP_PATH}' -Force"`);
  } else {
    // Unix zip
    execSync(`cd '${TEMP_DIR}' && zip -r '${ZIP_PATH}' ./*`);
  }

  // 5. Cleanup
  console.log('Cleaning up temporary directories...');
  deleteFolderRecursive(TEMP_DIR);

  console.log(`\nSUCCESS: Clean project ZIP created at:\n${ZIP_PATH}`);
} catch (error) {
  console.error('\nERROR: Packaging failed.', error);
  // Cleanup in case of failure
  if (fs.existsSync(TEMP_DIR)) {
    deleteFolderRecursive(TEMP_DIR);
  }
  process.exit(1);
}
