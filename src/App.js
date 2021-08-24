import React , {useEffect,useState} from 'react';
import FileStorageabi from './contracts/FileStorage.json';
import Web3 from 'web3';
import Body from './Body';
import Navbar from './Navbar';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient.create({host:'ipfs.infura.io',port:5001,protocol:'https'})

function App() {

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  },[])

  const[currentAccount,setCurrentAccount] = useState("");
  const[loader,setLoader] = useState(true);
  const[filestorageSM,setfilestorageSM] = useState();   /* SM means smart contract */
  const[filescount,setfilescount] = useState();

  // loadweb3 is a part of boilerplate code.
  const loadWeb3 = async() => {
    if(window.ethereum)
    {
      window.web3 = new  Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if(window.web3)
    {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else
    {
      window.alert("Metamask not detected");
    }
  };

  // loadblockchaindata is a boiler plate code
  const loadBlockchainData = async ()=>{
    setLoader(true);
    const web3 = window.web3;

    const accounts=await web3.eth.getAccounts();
    console.log("accounts:-"+accounts);
    // const account = accounts[0];
    setCurrentAccount(accounts[0]);

    const networkId = await web3.eth.net.getId();

    console.log("networkId:-"+networkId);

    const networkData = FileStorageabi.networks[networkId];/* networkData is returning undefined */

    console.log("networkData:-"+networkData);

    var address="0x056b6580c1E50b123b78454ACD8A50fCFd56E887";
    if(networkId == 5777)
    {
      const filestorage = new web3.eth.Contract(FileStorageabi.abi,address); //here we are calling our contract 
      setfilestorageSM(filestorage);

      const filescount = await filestorage.methods.fileCount().call();
      setfilescount(filescount);

      for(var i=filescount;i>=1;i--)
      {
        const file = await filestorage.methods.files(i).call();
        
      }
      
      // const candidate1 = await election.methods.candidates(1).call(); //here we are calling candidates mapping from our smart contract
      

      // const candidate2 = await election.methods.candidates(2).call();
      
      
      
      setLoader(false);
    }
    else
    {
      window.alert("Smart contract is not deployed");
    }
  };

  
  

  if(loader)
  {
    return <div>loading...</div>
  }

  return(
    <div>
      <Navbar account={currentAccount}/>
      <Body filestorageSM={filestorageSM} account={currentAccount}/>
    </div>

  );
  }

export default App;
