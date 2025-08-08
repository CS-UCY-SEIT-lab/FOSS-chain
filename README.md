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
```

2. Set Up the Database
Use the included `ade.sql` file to set up the MySQL database:
```bash
mysql -u root -p < ade.sql
```

3. Install Node & Hardhat Dependencies
```bash
npm install
```

4. Compile & Deploy Smart Contracts
Start a local Hardhat node:
```bash
npx hardhat node
```
In a second terminal, deploy your contracts:
```bash
npx hardhat run scripts/deploy.js --network localhost
```
This will output:

Contract address for LicenseManager

Contract address for DownloadAgreement

THIS IS IMPORTANT. Update main-portal.js with the new addresses of the 2 contracts.(at the top of the file)

# LOG IN USING THE FOLLOWING (demo user in the database)
username : USER

password : test

Start your server and visit log in page and you are good to go.

# Video

A demonstration video of FOSS-chain is available on YouTube: 
https://www.youtube.com/watch?v=mcb1ZCnysN8

# Evaluation

YOu can help us improve FOSS-chain by replying to the questionnaire available here: 
https://docs.google.com/forms/d/e/1FAIpQLSezVHHXbJLucDyG45biimWAv_sH-WWZTl1Nlgr8FapXQGzQDg/viewform?usp=dialog

# Citing this work

In order to cite this work, please use the following citation: 
K. Iacovou, G.M. Kapitsaki, E. Vanezi, "FOSS-chain: using blockchain for Open Source Software license compliance",
accepted at the 26th International Conference on Product-Focused Software Process Improvement (PROFES 25), Salerno, Italy, 2025.
