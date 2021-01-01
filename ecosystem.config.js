module.exports = {
  apps: [
    {
      script: 'src/index.js',
      watch: '.'
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
        'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
}
