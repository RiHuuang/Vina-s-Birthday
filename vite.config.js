import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function getBasePath() {
  if (process.env.VITE_BASE_PATH) {
    return process.env.VITE_BASE_PATH;
  }

  const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
  if (!repositoryName) {
    return './';
  }

  return repositoryName.endsWith('.github.io') ? '/' : `/${repositoryName}/`;
}

export default defineConfig({
  base: getBasePath(),
  plugins: [react()],
});
