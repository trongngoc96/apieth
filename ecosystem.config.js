module.exports = {
  apps: [{
    name: 'API',
    script: 'server.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    instances: 1,
    autorestart: true,
    ignore_watch : ["logs"],
    max_memory_restart: '250M',
    env: {
      NODE_ENV: 'development',
      PORT: '3000'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: '80'
    }
  },
  {
    name: 'TOKEN QUEUE',
    script: './app/queues/tokenQueue.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    instances: 1,
    autorestart: true,
    ignore_watch : ["logs"],
    max_memory_restart: '250M',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  },
  {
    name: 'EVENT TRANSFER',
    script: './app/microservice/eventTransfer.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    instances: 1,
    autorestart: true,
    ignore_watch : ["logs"],
    max_memory_restart: '250M',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }
]
};
