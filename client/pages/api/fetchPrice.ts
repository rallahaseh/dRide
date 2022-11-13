

export const getETHPrice = async (price: number): Promise<number> => {
    let url = 'https://min-api.cryptocompare.com/data/price?fsym=EUR&tsyms=ETH'
    const response = await fetch(url)
    const data = await response.json()
    let currentPrice = data.ETH;
    let finalPrice = currentPrice * price;
    return finalPrice;
};
