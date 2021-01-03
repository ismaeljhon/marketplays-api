module.exports = {
  apps: [
    {
      name: 'BackendStaging',
      script: 'npm run staging',
      watch: '.',
      env_production: {
        'NODE_ENV': 'production'
      },
      env_staging: {
        'NODE_ENV': 'production'
      },
      env: {
        'NODE_ENV': 'development'
      }
    }
  ],

  deploy: {
    staging: {
      user: 'root',
      host: 'staging.marketplays.app',
      ref: 'origin/staging',
      repo: 'https://github.com/kyleag/marketplays-api.git',
      path: '/home/marketplays/public_html/staging/backend',
      'pre-deploy-local': '',
      'post-deploy':
        'git pull origin staging && npm install && pm2 startOrReload ecosystem.config.js --env staging',
      'pre-setup': ''
    }
  }
}
