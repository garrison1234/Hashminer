module.exports = {
     // See <http://truffleframework.com/docs/advanced/configuration>
     // to customize your Truffle configuration!
     networks: {
          ganache: {
               host: "localhost",
               port: 7545,
               network_id: "*" // Match any network id
          },
        	gan: {
        		host: "localhost",
        		port: 7546,
        		network_id: "*"
         },
         rinkeby: {
           host: "localhost",
           port: 8545,
           network_id: 4, //rinkeby test network
           gas: 4700000
         }

     }
};
