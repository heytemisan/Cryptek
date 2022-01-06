import React , {useState, useEffect} from 'react';
import { ethers } from 'ethers';
import {contractABI , contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();
const { ethereum } = window;

const getEthereumContract = () => {
    //pass in ethereum windows object
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);
    return transactionContract;
}

export const TransactionProvider = ({children})=> {   
    const [currentAccount, setCurrentAccount] = useState('') //check if current account is con  
    const [formData, setFormData] = useState({addressTo:'', amount:'', keyword:'',message: ''});
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount]= useState(localStorage.getItem('transactionCount'))

    //for interecting with the input
    const handleChange =(e, name)=> {
        setFormData((prevState)=> ({...prevState, [name]: e.target.value}) );
    }

    const getAllTransactions = async()=> {
        try{
            if (!ethereum) return alert("please install metamask");
            const transactionContract = getEthereumContract();
            const availableTransactions = await transactionContract.getAllTransactions();
            console.log(availableTransactions);
        }catch (error) {
            console.log(error);
        }
    }

    const checkIfWalletIsConnected = async() => {
        try {
            if (!ethereum) return alert("Wallet is not connected, please install metamask");
            const accounts = await ethereum.request({method: 'eth_accounts'});
            if (accounts.length) {
                setCurrentAccount(accounts[0]);
                getAllTransactions();
            } else {
                console.log('No account found');
            }
        } catch (error) {
            console.log(error);
            // throw new Error("No ethereum object.")
        }
    }

    const connectWallet = async() => {
        try {
            if (!ethereum) return alert("Wallet is not connected, please install metamask");
            //request accounts to connect;
            const accounts = await ethereum.request({method: 'eth_requestAccounts'});
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.")
        }
    }

    const checkIfTransactionsExist = async() => {
        try {
            if (ethereum) {
                const transactionContract = getEthereumContract();
                const transactionsCount = await transactionsContract.getTransactionCount();   
                window.localStorage.setItem('transactionCount', transactionsCount)
            }
        } catch (error) {
            console.log(error)
            throw new Error("No ethereum object.")
        }
    }

    
        const sendTransaction = async () => {
            try {
            if (ethereum) {
                const { addressTo, amount, keyword, message } = formData;
                const transactionContract = getEthereumContract();
                //send ethereum transaction
                const parsedAmount = ethers.utils.parseEther(amount);      
                await ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: "0x5208",//21000 GWEI
                    value: parsedAmount._hex, //0.0001
                }],
                });
        
                const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
        
                setIsLoading(true);
                console.log(`Loading - ${transactionHash.hash}`);
                await transactionHash.wait();
                console.log(`Success - ${transactionHash.hash}`);
                setIsLoading(false);
        
                const transactionsCount = await transactionsContract.getTransactionCount();
        
                setTransactionCount(transactionsCount.toNumber());
            } else {
                console.log("No ethereum object");
            }
            } catch (error) {
            console.log(error);
        
            throw new Error("No ethereum object");
            }
        };

    useEffect(() => {
        //after words call all functions
        checkIfWalletIsConnected();
        checkIfTransactionsExist();
    },[])

    return (
        <TransactionContext.Provider value={{connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction}}>
            {children}
        </TransactionContext.Provider>
    )
}