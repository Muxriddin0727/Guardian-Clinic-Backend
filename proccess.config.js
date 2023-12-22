module.exports = {
    apps : [{
      name   : "Guardian_Care-backend",
      cwd: "./",
      script : "./server.js",
      watch: true,
      env_production: {
         NODE_ENV: "production"
         
      },
      env_development: {
         NODE_ENV: "development"
      },
      instances: "max",
      exec_mode: "cluster",
    }]
  }