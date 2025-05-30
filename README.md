# This is a web application and blockchain-based system for managing Open Source Software (OSS) submissions and ensuring license compatibility. It includes a PHP backend, a Hardhat Ethereum smart contract, and a frontend that lets users upload, download, and track software licenses on-chain.

---

## Requirements

Ensure you have these installed:

- Node.js (v16+)
- npm (Node package manager)
- PHP (v7.4+)
- MySQL or MariaDB
- Hardhat (for smart contract development)
- Git

Optional:
- XAMPP/MAMP for easier local PHP+MySQL setup

1. Clone the Repository
```bash
git clone https://github.com/CS-UCY-SEIT-lab/FOSS-Chain.git
cd FOSS-Chain

2. Set Up the Database
Use phpMyAdmin or MySQL CLI.
Manually create the database (name it "ade" to work with the existing php files).
Create these tables:
users
projects
license_compatibility

3. Install Node & Hardhat Dependencies
npm install
4. Compile & Deploy Smart Contracts
Start a local Hardhat node:
npx hardhat node
In a second terminal, deploy your contracts:
npx hardhat run scripts/deploy.js --network localhost

This will output:
Contract address for LicenseManager
Contract address for DownloadAgreement
THIS IS IMPORTANT. Update main-portal.js with the new addresses of the 2 contracts.(at the top of the file)
Start your server and visit register page and you are good to go.
