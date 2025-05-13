require("dotenv").config(); // Učitavanje .env fajla

const express = require("express");
const cors = require("cors");
const { ethers, providers } = require("ethers");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const LIDO_ADDRESS = "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84";
const LIDO_ABI = [
  "function balanceOf(address account) view returns (uint256)"
];

// Lista korisnika koji su stakeovali
let stakers = [];

// Provider za čitanje sa Ethereum mainneta (ili fork)
const provider = new providers.JsonRpcProvider(process.env.MAINNET_RPC);

// Endpoint: dodavanje adrese
app.post("/stake", (req, res) => {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: "Missing address" });
  }

  if (!stakers.includes(address.toLowerCase())) {
    stakers.push(address.toLowerCase());
  }

  res.json({ message: "✅ Address added" });
});

// Endpoint: ukupan stETH svih korisnika
app.get("/total-staked", async (req, res) => {
  try {
    const lido = new ethers.Contract(LIDO_ADDRESS, LIDO_ABI, provider);
    let total = ethers.BigNumber.from(0);

    for (let addr of stakers) {
      const balance = await lido.balanceOf(addr);
      total = total.add(balance);
    }

    res.json({ totalStETH: ethers.utils.formatEther(total) });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("Failed to fetch balances");
  }
});

// Pokreni server
app.listen(PORT, () => {
  console.log(`✅ Backend server running at http://localhost:${PORT}`);
});
