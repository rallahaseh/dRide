const ACCOUNT = "0x107bB844410F9EafEE546163146E832D5a54CB2b";

const main = async (cb) => {
    try {
        await web3.currentProvider.send({
            method:"evm_setAccountBalance",
            params:[ACCOUNT, "0x3635c9adc5dea00000"]}, function() {}
        )
        console.log(await web3.eth.getBalance(ACCOUNT));
    } catch(err) {
        console.log(err);
    }
    cb();
}

module.exports = main;
