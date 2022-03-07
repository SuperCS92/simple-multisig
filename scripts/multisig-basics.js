const { ethers, network } = require("hardhat");
const lightwallet = require('eth-lightwallet');


let DOMAIN_SEPARATOR
const TXTYPE_HASH = '0x3ee892349ae4bbe61dce18f95115b5dc02daf49204cc602458cd4c1f540d56d7'
const NAME_HASH = '0xb7a0bfa1b79f2443f4d73ebb9259cddbcd510b18be6fc4da7d1aa7b1786e73e6'
const VERSION_HASH = '0xc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6'
const EIP712DOMAINTYPE_HASH = '0xd87cd6ef79d4e2b95e15ce8abf732db51ec771f1ca2edccf22a46c729ac56472'
const SALT = '0x251543af6a222378665a76fe38dbceae4871a070b7fdaf5c6c30cf758dc33cc0'

const HARDHATCHAINID = 31337
const ZEROADDR = '0x000000000000000000000000000000000000000000000'

let TwoEther = '2000000000000000000';

let keyFromPw
let acct
let lw
let seed = "test test test test test test test test test test test junk"

let deployer;
let user1, user2, user3, user4;


function converter(_price, _decimals){
    const decimals = (10 ** _decimals) 
    const result = _price / decimals;
  
    return result;
  }

  //https://github.com/NomicFoundation/hardhat/issues/1972

  function sign(address, data) {
    return hre.network.provider.send(
      "eth_sign",
      [address, data]
    )
  }

  let createSigs = async function(signers, multisigAddr, nonce, destinationAddr, value, data, executor, gasLimit) {

    const domainData = EIP712DOMAINTYPE_HASH + NAME_HASH.slice(2) + VERSION_HASH.slice(2) + HARDHATCHAINID.toString('16').padStart(64, '0') + multisigAddr.slice(2).padStart(64, '0') + SALT.slice(2)
    //DOMAIN_SEPARATOR = web3.sha3(domainData, {encoding: 'hex'})
    DOMAIN_SEPARATOR = ethers.utils.keccak256(domainData)

    let txInput = TXTYPE_HASH + destinationAddr.slice(2).padStart(64, '0') + value.toString('16').padStart(64, '0') + ethers.utils.keccak256(data).slice(2) + nonce.toString('16').padStart(64, '0') + executor.slice(2).padStart(64, '0') + gasLimit.toString('16').padStart(64, '0')
    let txInputHash = ethers.utils.keccak256(txInput)
    
    let input = '0x19' + '01' + DOMAIN_SEPARATOR.slice(2) + txInputHash.slice(2)
    let hash = ethers.utils.keccak256(input)
    
    let sigV = []
    let sigR = []
    let sigS = []

    for (var i=0; i<signers.length; i++) {
      let sig = lightwallet.signing.signMsgHash(lw, keyFromPw, hash, signers[i])
      // let sig = await ethers.signers[i].signMessage(hash);
      sigV.push(sig.v)
      sigR.push('0x' + sig.r.toString('hex'))
      sigS.push('0x' + sig.s.toString('hex'))
    }

    if (signers[0] == acct[0]) {
      console.log("Signer: " + signers[0])
      console.log("Wallet address: " + multisigAddr)
      console.log("Destination: " + destinationAddr)
      console.log("Value: " + value)
      console.log("Data: " + data)
      console.log("Nonce: " + nonce)
      console.log("Executor: " + executor)
      console.log("gasLimit: " + gasLimit)
      console.log("r: " + sigR[0])
      console.log("s: " + sigS[0])
      console.log("v: " + sigV[0])
     }
      
    return {sigV: sigV, sigR: sigR, sigS: sigS}

  }


async function main() {

   
 
    //if( network == kovan)
    [ deployer, user1, user2, user3, user4 ] = await ethers.getSigners();
    console.log(user1)

    console.log(
        "Deploying contracts with the account:",
        deployer.address
      );
    
    let signersUnordered = [ user1.address, user2.address, user3.address]
    console.log(signersUnordered)
    const signers = signersUnordered.sort();
    console.log(signers)

    const SimpleMultiSig = await ethers.getContractFactory("SimpleMultiSig");
    const simpleMultiSig = await SimpleMultiSig.deploy(2, signers, HARDHATCHAINID);
    console.log("Deployed SimpleMultiSig contract address:", simpleMultiSig.address);

    const WETH = await ethers.getContractFactory("WETH");
    const weth = await WETH.deploy(deployer.address);
    console.log("Deployed WETH contract address:", weth.address);

    weth.transfer(simpleMultiSig.address, TwoEther);
    let simpleMultiSigBalance = await weth.balanceOf(simpleMultiSig.address);
    simpleMultiSigBalance = converter( simpleMultiSigBalance, 18)
    console.log('SimpleMultiSig balance of Weth after transfer:', simpleMultiSigBalance.toString());

   const wethInterface = WETH.interface

//    console.log( wethInterface.format(ethers.utils.FormatTypes.full ))

   const wethTransferData = wethInterface.encodeFunctionData("transfer", [user4.address, TwoEther]);
//    console.log(wethTransferData)
//    console.log(user4.address)

signedMessage = await createSigs([user3, user2, user4], simpleMultiSig.address, 0, weth.address, '0', wethTransferData, deployer.address,200000)
console.log(signedMessage)

// const message = await sign(user1.address, wethTransferData)
// console.log(message)
  }

main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });