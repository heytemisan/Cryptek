const main = async () => {

  const Transactions = await hre.ethers.getContractFactory("Transactions");
  const transaction = await Transactions.deploy();

  await greeter.deployed();

  console.log("Transactions deployed to:", transaction.address);
}

const runmain = async () => {
  try {
    await main();
    process.exit()
  } catch (error) {
    
  }
}
