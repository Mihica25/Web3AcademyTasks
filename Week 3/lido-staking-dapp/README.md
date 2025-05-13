!# Lido Staking dApp

This is a decentralized application (dApp) that allows users to stake ETH through the Lido protocol, view their stETH balance, and simulate unstaking flow.  
It includes a React frontend and a Node.js/Express backend that tracks total stETH across all users.

## 🧱 Tech Stack

- React + Ethers.js (frontend)
- Node.js + Express + Ethers.js (backend)
- Tenderly mainnet fork (testing)
- Lido protocol on Ethereum mainnet

---

## 🚀 How to Run

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/lido-staking-dapp.git
cd lido-staking-dapp
```

### 2. Setup frontend
```bash
npm install
npm start
```

### 3. Setup backend
```bash
cd backend
npm install
cp .env.example .env
# Paste your Tenderly RPC URL into .env
node index.js
```

---

## 📄 .env format

### backend/.env
```
MAINNET_RPC=https://rpc.tenderly.co/fork/YOUR_KEY
```

---

## 🔍 Tenderly Fork

You can simulate staking on Ethereum mainnet using Tenderly Fork  
→ Create fork: [https://dashboard.tenderly.co](https://dashboard.tenderly.co)  
→ Use the provided RPC in `.env`

---