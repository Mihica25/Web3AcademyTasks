import { useState, useEffect } from "react";
import { ethers } from "ethers";
import './App.css';

const LIDO_ADDRESS = "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84";
const LIDO_ABI = [
  "function submit(address _referral) external payable returns (uint256)",
  "function balanceOf(address account) view returns (uint256)"
];

function App() {
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [address, setAddress] = useState();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const connect = async () => {
      if (window.ethereum) {
        const prov = new ethers.providers.Web3Provider(window.ethereum);
        await prov.send("eth_requestAccounts", []);
        const signer = prov.getSigner();
        const addr = await signer.getAddress();

        setProvider(prov);
        setSigner(signer);
        setAddress(addr);
      }
    };
    connect();
  }, []);

  const stakeETH = async (ethAmount) => {
    try {
      setLoading(true);
      const lido = new ethers.Contract(LIDO_ADDRESS, LIDO_ABI, signer);
      const tx = await lido.submit(
        "0x0000000000000000000000000000000000000000",
        {
          value: ethers.utils.parseEther(ethAmount),
        }
      );
      
      await tx.wait();
      
      await fetch("http://localhost:3001/stake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      
      alert("✅ Staking successful!");
    } catch (error) {
      console.error("❌ Staking failed:", error);
      alert("❌ Error staking ETH");
    } finally {
      setLoading(false);
    }
  };
  
  const getTotalStaked = async () => {
    try {
      const res = await fetch("http://localhost:3001/total-staked");
      const data = await res.json();
      alert("🌍 Total stETH staked by all users: " + data.totalStETH);
    } catch (err) {
      alert("❌ Failed to fetch total staked");
    }
  };

  const getStEthBalance = async () => {
    try {
      const lido = new ethers.Contract(LIDO_ADDRESS, LIDO_ABI, provider);
      const balance = await lido.balanceOf(address);
      alert("📊 stETH Balance: " + ethers.utils.formatEther(balance));
    } catch (error) {
      alert("⚠️ Error fetching balance");
    }
  };

  return (
    <div className="app">
      <h2>Lido Staking dApp</h2>
      <p>Connected wallet: {address}</p>

      <input
        type="text"
        placeholder="Amount in ETH"
        onChange={(e) => setAmount(e.target.value)}
        value={amount}
      />
      <button onClick={() => stakeETH(amount)} disabled={loading}>
        {loading ? "Staking..." : "Stake ETH"}
      </button>
      <button onClick={getStEthBalance}>Check stETH Balance</button>
      <button onClick={getTotalStaked}>Get Total stETH (All Users)</button>
      <div className="withdrawals-info">
        <h4>Unstaking Info</h4>
        <p>
          Direct unstaking is not available via smart contracts at the moment. To convert stETH back
          to ETH, users typically use DEXs like Curve or 1inch. Lido V2 introduces withdrawals, but
          they require exiting via the Lido queue or frontend.
        </p>
      </div>
    </div>
  );
}

export default App;
