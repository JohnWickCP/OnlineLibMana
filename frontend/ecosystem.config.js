// frontend/ecosystem.config.js
module.exports = {
  apps: [{
    name: 'next-app',
    cwd: '/home/ubuntu/next-app',           // Đường dẫn trên EC2
    script: 'yarn',
    args: 'start -p 3000',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: '/home/ubuntu/next-app/logs/err.log',
    out_file: '/home/ubuntu/next-app/logs/out.log',
    log_file: '/home/ubuntu/next-app/logs/combined.log',
    time: true
  }]
};