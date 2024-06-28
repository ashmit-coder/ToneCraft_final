import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Navigation from './Navbar';
import Home from './Home.js'
import Create from './Create.js'
import MarketplaceAbi from '../contractsData/Marketplace.json'
import MarketplaceAddress from '../contractsData/Marketplace-address.json'
import NFTAbi from '../contractsData/NFT.json'
import NFTAddress from '../contractsData/NFT-address.json'
import { useState } from 'react'
import { ethers } from "ethers"
import { Spinner } from 'react-bootstrap'
import LandingPage from "./LangingPage.js";
import Profile from "./Profile.js";
import './App.css';
function App() {
  const [loading, setLoading] = useState(false)
  const [account, setAccount] = useState(null)
  const [isAuth,setAuth] = useState(false)
  const [nft, setNFT] = useState({})
  const [marketplace, setMarketplace] = useState({})
  // MetaMask Login/Connect
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])
    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Set signer
    const signer = provider.getSigner()

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    
    
    

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0])
      await web3Handler()
    })
    loadContracts(signer)
  }
  const loadContracts = async (signer) => {
    // Get deployed copies of contracts
    const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer)
    setMarketplace(marketplace)
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
    setNFT(nft)
    setLoading(false)
    setAuth(true)
  }

  return (
    <BrowserRouter>
      <div className="App">
        <><Navigation web3Handler={web3Handler} account={account} /></> 
        <div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
              <Spinner animation="border" style={{ display: 'flex' }} />
              <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={
                <LandingPage web3Handler={web3Handler} account={account}></LandingPage>
              } />
               <Route path="/buy" element={isAuth?(
              <Home nft={nft} marketplace={marketplace}/>):<Navigate replace to={"/"} />}></Route>
              <Route path="/create" element={isAuth?(
                <Create marketplace={marketplace} nft={nft} />):<Navigate replace to={"/"} />
              } />
              <Route path="/profile" element={isAuth?(<Profile marketplace={marketplace} nft={nft} account={account}></Profile>):<Navigate replace to={"/"}/>}></Route>
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>

  );
}

export default App;
