import "./App.css";
import { useEffect, useState } from "react";
// import {
//   fetchGreeting,
//   getBalance,
//   setGreeting,
//   sendCoins,
// } from "./utils/contractTest";
import styled from "styled-components";
import { greeterAddress, tokenAddress } from "./constants/listAddress";
import { ethers, BigNumber } from "ethers";
import Token from "./config/abis//Token.json";
import { Upload, message, Button } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

function App() {
  const [userAccount, setUserAccount] = useState();
  const [balance, setBalance] = useState();
  const [procesing, setProcesing] = useState(false);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      console.log("MetaMask is installed!");
      requestAccount();
    } else alert("MetaMask is not installed yet!");

    window.ethereum.on("accountsChanged", async function (accounts) {
      alert("ADDRESS: " + accounts);
      requestAccount();
    });
  }, []);

  async function requestAccount() {
    if (typeof window.ethereum !== "undefined") {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setUserAccount(account.substr(0, 4) + ".." + account.substr(-4, 4));
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token, provider);
      const balance = (await contract.balanceOf(account)).toString();
      setBalance((parseFloat(balance) * Math.pow(10, -18)).toFixed(3));
    }
  }

  function csvJSON(csv) {
    var lines = csv.split("\n");

    var result = [];

    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {
      var obj = {};
      var currentline = lines[i].split(",");

      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }

    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
  }

  // async function sendCoins() {
  //   if (typeof window.ethereum !== "undefined") {
  //     await requestAccount();
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();
  //     const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
  //     const transation = await contract.transfer(userAccount, amount);
  //     await transation.wait();
  //     console.log(`${amount} Coins successfully sent to ${userAccount}`);
  //   }
  // }
  const props = {
    name: "file",
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    onChange(info) {
      const { status } = info.file;
      const formData = new FormData();
      formData.append("file", info.file[0]);
      formData.append("upload_shihi", "asasas");

      if (status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (status === "done") {
        if (info.file.type.split("/")[1] == "csv") setProcesing(true);
        console.log("done", formData);
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const StyledDragger = styled(Dragger)`
    border: 1px solid #00fff4;
    padding: 20px;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.5s ease 0s;
    :hover {
      transform: scale(0.8);
    }
  `;

  const StyledButton = styled.div`
    cursor: pointer;
    position: relative;
    background: rgb(24, 175, 247);
    border-radius: 24px;
    width: 200px;
    height: 56px;
    -webkit-box-align: center;
    align-items: center;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    margin-top: 20px;
    cursor: pointer;
    transition: all 0.5s ease 0s;
    :hover {
      transform: scale(0.8);
    }
    &.disabled {
      cursor: not-allowed;
      position: relative;
      background: rgb(138, 138, 138);
      :hover {
        transform: unset;
      }
    }
  `;

  return (
    <div className="App">
      <header className="App-header">
        <h1>SEND TOKEN</h1>
        <div id="connect">
          <p>
            Address: <span>{userAccount}</span>
          </p>
          <p>
            Balance: <span>{balance}</span>
          </p>
        </div>
        <StyledDragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">File type: text/csv</p>
        </StyledDragger>
        <StyledButton className={procesing ? "" : "disabled"}>
          <span></span>
          {/* {!procesing ?<p>Run </p> : <p> Procesing </p>} */}
          <p>Run </p>

          <span></span>
        </StyledButton>
      </header>
    </div>
  );
}

export default App;
