const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const LicenseManager = await hre.ethers.getContractFactory("LicenseManager");
  const licenseManager = await LicenseManager.deploy();
  await licenseManager.deployed();
  console.log("LicenseManager deployed to:", licenseManager.address); //show address of deployment

  const DownloadAgreement = await hre.ethers.getContractFactory(
    "DownloadAgreement"
  );
  const downloadAgreement = await DownloadAgreement.deploy();
  await downloadAgreement.deployed();
  console.log("DownloadAgreement deployed to:", downloadAgreement.address); //same here
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
