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

async function main() {

    const WETH = await ethers.getContractFactory("WETH");

    const wethInterface = WETH.interface

   const wethTransferData = wethInterface.encodeFunctionData("transfer", [user, TwoEther]);
   console.log('wethTransferData: ',wethTransferData)

  }

main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });