import React , {useState} from "react";
import './App.css';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient.create({host:'ipfs.infura.io',port:5001,protocol:'https'})

// const {create} = require('ipfs-http-client')
// const ipfs = create({host:'ipfs.infura.io',port:5001,protocol:'https'})



const Body = ({filestorageSM,account}) => {

    const[buffer,setBuffer] = useState("");
    const[type,setType] = useState("");
    const[name,setName] = useState("");

    const captureFile = (e) => {
        e.preventDefault()
    
        const file = e.target.files[0]
        const reader = new window.FileReader()
    
        reader.readAsArrayBuffer(file) //The FileReader interface's readAsArrayBuffer() method is used to start reading the contents of a specified Blob or File.
        reader.onloadend = () => {     //When the read operation is finished, the readyState becomes DONE, and the loadend is triggered.
          setBuffer(Buffer(reader.result))
          setType(file.type)
          setName(file.name)
        }
      }


          console.log('buffer:', buffer)
          console.log('type:', type)
          console.log('name:', name)


    //here we define a function onsubmit
    const onsubmit = async(e) => { //We have declared "ipfs.add" to await. This means it will stop for till "ipfs.add" doesn't complete execution. i.e. why i declared onSubmit as async function.
        e.preventDefault();
        
        console.log("Submitting file to IPFS...");

        //below commented block of code is outdated
        /* ipfs.add(buffer,(error,result)=>{ //when we send buffer, we can get error or unique hash in return.  
          if(error)
          {
            return console.log(error)
          }
          else
          {
            console.log(result)
          }
        }) */

        //add file to the ipfs
        if(buffer) //if any file is uploaded
        {
          try{
            const result = await ipfs.add(buffer)
            console.log("IPFS result:",result);
            console.log("To open uploaded file, click on: https://ipfs.infura.io/ipfs/"+result.path)

            let description="a file";
            await filestorageSM.methods.uploadFile(result.path, result.size, type, name, description).send({from:account}).on("transactionHash",()=>{
              console.log("Successfully ran");

            }).on('error',console.error)
          }
          catch(e){
            console.log("Error:",e);
          }
        }
        else
        {
          alert("No files submitted. Please try again.");
          console.log('ERROR: No data to submit');
        }
    }

    return(
        <form id="upload" onSubmit={onsubmit}>
            <input type="file" onChange={captureFile}/>
            <button type="submit">Upload</button>
        </form>
    )
}

export default Body;