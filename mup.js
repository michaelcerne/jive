module.exports = {
  servers: {
    one: {
      // TODO: set host address, username, and authentication method
      host: '512cdn.net',
      username: 'root',
      // pem: './path/to/pem'
      password: 'mainSyStemsLOG512!'
      // or neither for authenticate from ssh-agent
    }
  },

  app: {
    // TODO: change app name and path
    name: 'jive',
    path: '../jive',

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      // TODO: Change to your app's url
      // If you are using ssl, it needs to start with https://
      ROOT_URL: 'https://512cdn.net/jive',
      MONGO_URL: 'mongodb://localhost/meteor',
    },

    // ssl: { // (optional)
    //   // Enables let's encrypt (optional)
    //   autogenerate: {
    //     email: 'email.address@domain.com',
    //     // comma separated list of domains
    //     domains: 'website.com,www.website.com'
    //   }
    // },

    docker: {
      // change to 'kadirahq/meteord' if your app is using Meteor 1.3 or older
      image: 'https://github.com/mrauhu/meteord',
    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true
  },

  mongo: {
    version: '3.4.1',
    servers: {
      one: {}
    }
  }
};
