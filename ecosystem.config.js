module.exports = {
  apps: [
    {
      name: 'BackendStaging',
      script: 'npm run staging',
      watch: '.',
      env: {
        'NODE_ENV': 'development'
      },
      env_production: {
        'NODE_ENV': 'production'
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
        'git pull origin staging && npm install && pm2 startOrReload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
}
