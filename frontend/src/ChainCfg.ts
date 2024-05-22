const ChainCfg = {
    1: {
        chainId: '0x1',
        chainName: 'Ethereum Mainnet',
        nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
        },
        rpcUrls: ['https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
        blockExplorerUrls: ['https://etherscan.io'],
    },
    5: {
        chainId: '0x5',
        chainName: 'Goerli testNet',
        nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
        },
        rpcUrls: ['https://goerli.blockpi.network/v1/rpc/public'],
        blockExplorerUrls: ['https://goerli.etherscan.io'],
    },
    7: {
        chainId: '0x15b31',
        chainName: 'Tenderly Fork',
        nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
        },
        rpcUrls: ['https://rpc.tenderly.co/fork/70a8feec-c810-45ed-bd0b-b352dc83aa97'],
        blockExplorerUrls: ['https://goerli.etherscan.io'],
    }
};
 
export default ChainCfg;