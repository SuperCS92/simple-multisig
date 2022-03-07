const { ethers, network } = require("hardhat");
const Web3 = require('web3')

let DOMAIN_SEPARATOR
const TXTYPE_HASH = '0x3ee892349ae4bbe61dce18f95115b5dc02daf49204cc602458cd4c1f540d56d7'
const NAME_HASH = '0xb7a0bfa1b79f2443f4d73ebb9259cddbcd510b18be6fc4da7d1aa7b1786e73e6'
const VERSION_HASH = '0xc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6'
const EIP712DOMAINTYPE_HASH = '0xd87cd6ef79d4e2b95e15ce8abf732db51ec771f1ca2edccf22a46c729ac56472'
const SALT = '0x251543af6a222378665a76fe38dbceae4871a070b7fdaf5c6c30cf758dc33cc0'

const HARDHATCHAINID = 31337
const MUMBAICHAINID = 80001


const ZEROADDR = '0x000000000000000000000000000000000000000000000'

let TwoEther = '2000000000000000000';

let keyFromPw

let lw
let seed = "test test test test test test test test test test test junk"

let deployer;
let user1, user2, user3, user4;
let ZEROVALUE = '0'

let ACC1_PRIVATE_KEY='3b9a5842056f4fd3a9eb8c757083c490e92e9003bccc4e4b56aa432c9b9f5dcc'


function converter(_price, _decimals){
    const decimals = (10 ** _decimals) 
    const result = _price / decimals;
  
    return result;
  }

let acc1 = '0xc857A6e6aAA2Ff5eD3ebDba6546Aa0A1DD393D74'
let acc2 = '0x385DbEaf4F1373742d35760eb7c72d4Ac879ab92'
let acc3 = '0x4CA956b20A33FC8D28c182E14B6d0b4CB06c6c0F'
let users = [acc1, acc2, acc3]
let usersAddr = [acc1, acc2, acc3]
let user = '0x84A6526a69423e55258BE42c47D4AA93553bAA3a'
//let wethTransferData = '0xa9059cbb00000000000000000000000084a6526a69423e55258be42c47d4aa93553baa3a0000000000000000000000000000000000000000000000001bc16d674ec80000'
let wethAddr = '0xC250772A98e96809B4155d96270cFfA629a9669d'
let execAddr = '0x24Ab85B0EcA82d719A473A6638c14CA4a3df7F1c'
let simpleMultiSigAddr = '0xa537E5F621C396dFEC7191514202A8b03e387a13'


async function main() {
   
    //if( network == kovan)
    [ deployer,  ] = await ethers.getSigners();
    //console.log(user1)

    console.log(
        "Deploying contracts with the account:",
        deployer.address
      );

      let wallet = web3.eth.accounts.wallet.create(0)
      //console.log(wallet)

      wallet.add(ACC1_PRIVATE_KEY)
      //console.log(wallet)

    //   console.log(usersAddr);
    //   usersAddr.sort();
    //   console.log(usersAddr);


        // const SimpleMultiSig = await ethers.getContractFactory("SimpleMultiSig");
        // const simpleMultiSig = await SimpleMultiSig.deploy(3, usersAddr, MUMBAICHAINID);
        // console.log("Deployed SimpleMultiSig contract address:", simpleMultiSig.address);

        // let domain_separator = await simpleMultiSig.GETDOMAIN_SEPARATOR();
        // console.log("domain_separator: ", domain_separator)

    const WETH = await ethers.getContractFactory("WETH");
    const wethInterface = WETH.interface
   const wethTransferData = wethInterface.encodeFunctionData("transfer", [user, TwoEther]);
   console.log('wethTransferData: ',wethTransferData)

    const domainData = EIP712DOMAINTYPE_HASH + NAME_HASH.slice(2) + VERSION_HASH.slice(2) + MUMBAICHAINID.toString('16').padStart(64, '0') + simpleMultiSigAddr.slice(2).padStart(64, '0') + SALT.slice(2)
    DOMAIN_SEPARATOR = web3.utils.sha3(domainData, {encoding: 'hex'})
    console.log('DOMAIN_SEPARATOR:',DOMAIN_SEPARATOR);

    let destinationAddr = wethAddr;
    let value = '0'
    let data = wethTransferData
    let nonce = 0
    let executor = execAddr
    let gasLimit = 200000

    let txInput = TXTYPE_HASH + destinationAddr.slice(2).padStart(64, '0') + value.toString('16').padStart(64, '0') + web3.utils.sha3(data).slice(2) + nonce.toString('16').padStart(64, '0') + executor.slice(2).padStart(64, '0') + gasLimit.toString('16').padStart(64, '0');
    console.log('txInput: ',txInput);
    let txInputHash = web3.utils.sha3(txInput)
    console.log('txInputHash: ',txInputHash);

    let input = '0x19' + '01' + DOMAIN_SEPARATOR.slice(2) + txInputHash.slice(2)
    console.log("input:", input)
    let hash = web3.utils.sha3(input, {encoding: 'hex'})
    console.log('hash: ', hash);

     let sigs = await wallet[0].sign(hash)
    // let sig = await deployer.signMessage(ethers.utils.arrayify( hash))

     console.log(sigs.signature);
    // console.log(sig)



    //console.log(users)

    // await simpleMultiSig.execute(sigs, destinationAddr, value, data, executor, gasLimit)

    // simpleMultiSigBalance = await weth.balanceOf(simpleMultiSig.address);
    // simpleMultiSigBalance = converter( simpleMultiSigBalance, 18)
    // console.log('SimpleMultiSig balance of Weth after transfer:', simpleMultiSigBalance.toString());

    // userSigBalance = await weth.balanceOf(user.address);
    // userSigBalance = converter( userSigBalance, 18)
    // console.log('user balance of Weth after transfer:', userSigBalance.toString());
  }

main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });