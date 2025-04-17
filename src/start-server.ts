
import { build } from 'esbuild';
import { exec } from 'child_process';

// Build the server with esbuild
async function buildServer() {
  try {
    await build({
      entryPoints: ['src/server.ts'],
      bundle: true,
      platform: 'node',
      target: 'node16',
      outfile: 'dist/server.js',
      external: ['mongoose', 'express', 'cors'],
    });
    console.log('Server built successfully');
    
    // Start the server
    const serverProcess = exec('node dist/server.js');
    
    serverProcess.stdout?.on('data', (data) => {
      console.log(`[SERVER]: ${data}`);
    });
    
    serverProcess.stderr?.on('data', (data) => {
      console.error(`[SERVER ERROR]: ${data}`);
    });
    
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildServer();
