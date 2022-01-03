// https://eth-ropsten.alchemyapi.io/v2/pVhPL6TPkztNv_sukRxRDR-XV29kff3H

require('@nomiclabs/hardhat-waffle');
module.exports = {
  solidity:'0.8.0',
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/pVhPL6TPkztNv_sukRxRDR-XV29kff3H',
      account: ['c09521b950aa1a677f368122d57bfed9bbd9dca270006653b5040d392b4499a1'],
    },
  },
}