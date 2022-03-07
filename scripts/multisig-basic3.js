const { ethers, network } = require("hardhat");
const Web3 = require('web3')

let DOMAIN_SEPARATOR
const TXTYPE_HASH = '0x3ee892349ae4bbe61dce18f95115b5dc02daf49204cc602458cd4c1f540d56d7'
const NAME_HASH = '0xb7a0bfa1b79f2443f4d73ebb9259cddbcd510b18be6fc4da7d1aa7b1786e73e6'
const VERSION_HASH = '0xc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6'
const EIP712DOMAINTYPE_HASH = '0xd87cd6ef79d4e2b95e15ce8abf732db51ec771f1ca2edccf22a46c729ac56472'
const SALT = '0x251543af6a222378665a76fe38dbceae4871a070b7fdaf5c6c30cf758dc33cc0'

const HARDHATCHAINID = 31337
//const HARDHATCHAINID = 1


const ZEROADDR = '0x000000000000000000000000000000000000000000000'

let TwoEther = '2000000000000000000';

let keyFromPw

let lw
let seed = "test test test test test test test test test test test junk"

let deployer;
let user1, user2, user3, user4;
let ZEROVALUE = '0'


function converter(_price, _decimals){
    const decimals = (10 ** _decimals) 
    const result = _price / decimals;
  
    return result;
  }

let entropy1 = '11111111111111111111111111111111'
let entropy2 = '11111111111111111111111111111112'
let entropy3 = '11111111111111111111111111111113'
let entropies = [entropy1, entropy2, entropy3]
let users = []
let usersAddr = []

async function main() {
   
    //if( network == kovan)
    [ deployer, user ] = await ethers.getSigners();
    //console.log(user1)

    console.log(
        "Deploying contracts with the account:",
        deployer.address
      );
    
      for (var i=0; i<entropies.length; i++)
      {
          let user = web3.eth.accounts.create(entropies[i])
          users.push(user);
      }

      for (var i=0; i<users.length; i++)
      {
          let addr = users[i].address
          usersAddr.push(addr);
      }

      console.log(usersAddr);
      usersAddr.sort();
      console.log(usersAddr);

      
//     let signersUnordered = [ user1.address, user2.address, user3.address]
//     console.log(signersUnordered)
//     const signers = signersUnordered.sort();
//     console.log(signers)

    const SimpleMultiSig = await ethers.getContractFactory("SimpleMultiSig");
    const simpleMultiSig = await SimpleMultiSig.deploy(3, usersAddr, HARDHATCHAINID);
    console.log("Deployed SimpleMultiSig contract address:", simpleMultiSig.address);


    let multiSigBalance = await ethers.provider.getBalance(simpleMultiSig.address)
    multiSigBalance = converter( multiSigBalance, 18)
    console.log('multiSigBalance:',multiSigBalance)

   await deployer.sendTransaction({
        to: simpleMultiSig.address,
        value: ethers.utils.parseEther("100.0")
    })

    multiSigBalance = await ethers.provider.getBalance(simpleMultiSig.address)
    multiSigBalance = ethers.utils.formatEther( multiSigBalance)
    console.log('multiSigBalance:',multiSigBalance)

    userBalance = await ethers.provider.getBalance(user.address)
    userBalance = ethers.utils.formatEther( userBalance)
    console.log('userBalance:',userBalance)

    const domainData = EIP712DOMAINTYPE_HASH + NAME_HASH.slice(2) + VERSION_HASH.slice(2) + HARDHATCHAINID.toString('16').padStart(64, '0') + simpleMultiSig.address.slice(2).padStart(64, '0') + SALT.slice(2)
    DOMAIN_SEPARATOR = web3.utils.sha3(domainData, {encoding: 'hex'})
    console.log('DOMAIN_SEPARATOR:',DOMAIN_SEPARATOR);


    
    let destinationAddr = user.address;
    let value = web3.utils.toHex('100000000000000000000');
    let data = web3.utils.sha3('This is a test', {encoding: 'hex'}) 
    let nonce = 0
    let executor = deployer.address
    let gasLimit = 200000

    console.log('value:',value)
    console.log('value.toString(16):', value.toString('16'))
    console.log('value.toString(16).padStart(64, 0):', value.toString('16').padStart(64, '0'));
    

    let txInput = TXTYPE_HASH + destinationAddr.slice(2).padStart(64, '0') + value.slice(2).toString('16').padStart(64, '0') + web3.utils.sha3(data).slice(2) + nonce.toString('16').padStart(64, '0') + executor.slice(2).padStart(64, '0') + gasLimit.toString('16').padStart(64, '0');
    console.log('txInput: ',txInput);
    let txInputHash = web3.utils.sha3(txInput)
    console.log('txInputHash: ',txInputHash);

    let input = '0x19' + '01' + DOMAIN_SEPARATOR.slice(2) + txInputHash.slice(2)
    let hash = web3.utils.sha3(input, {encoding: 'hex'})
    console.log('hash: ', hash);

    let sigs = []

    users.sort((a, b)=>{return a.address - b.address})

    for (var i=0; i<users.length; i++) {
        let sig = users[i].sign(hash)
        sigs.push(sig.signature.toString('hex'))
    }

    await simpleMultiSig.execute(sigs, destinationAddr, value,data, executor, gasLimit)

    multiSigBalance = await ethers.provider.getBalance(simpleMultiSig.address)
    multiSigBalance = ethers.utils.formatEther( multiSigBalance)
    console.log('multiSigBalance:',multiSigBalance)

    userBalance = await ethers.provider.getBalance(user.address)
    userBalance = ethers.utils.formatEther( userBalance)
    console.log('userBalance:',userBalance)
  }

main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });