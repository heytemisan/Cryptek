import React , {useState, useEffect} from 'react';
import { ethers } from 'ethers';
import {contractABI , contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();
const { ethereum } = window;

const getEthereumContract = () => {
    //pass in ethereum windows object
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);
    return transactionsContract;
}

export const TransactionProvider = ({children})=> {   
    const [currentAccount, setCurrentAccount] = useState('') //check if current account is connected to metamask
    const [formData, setFormData] = useState({addressTo:'', amount:'', keyword:'',message: ''});
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount]= useState(localStorage.getItem('transactionCount'))
    const [transactions, setTransactions] = useState([])

    //for interecting with the input. 
    //nb, this dynamically goes along with the form
    const handleChange =(e, name)=> {
        setFormData((prevState)=> ({...prevState, [name]: e.target.value}) );
    }

    const getAllTransactions = async()=> {
        try{
            if (!ethereum) return alert("please install metamask");
            const transactionsContract = getEthereumContract();
            const availableTransactions = await transactionsContract.getAllTransactions();


            const structuredTransactions = availableTransactions.map((transaction)=> ({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: parseInt(transaction.amount._hex)/(10 ** 18)//hex decimal Wei
            }))

            // console.log(availableTransactions);
            console.log(structuredTransactions);
            setTransactions(structuredTransactions);
        }catch (error) {
            console.log(error);
        }
    }

    const checkIfWalletIsConnected = async() => {
        try {
            if (!ethereum) return alert("Wallet is not connected, please install metamask");
            const accounts = await ethereum.request({method: 'eth_accounts'});
            if (accounts.length) {
                setCurrentAccount(accounts[0]);//gives access to metamask account
                getAllTransactions();
            } else {
                console.log('No account found');
            }
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.")
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
            throw new Error("No ethereum object.");
        }
    }

    const checkIfTransactionsExist = async() => {
        try {
            if (ethereum) {
                const transactionsContract = getEthereumContract();
                const transactionCount = await transactionsContract.getTransactionCount();   
                window.localStorage.setItem('transactionCount', transactionCount)
            }
        } catch (error) {
            console.log(error)
            throw new Error("No ethereum object.")
        }
    }

    
        const sendTransaction = async () => {
            //basically for sending and storing transactions
            try {
            if (ethereum) {
                const { addressTo, amount, keyword, message } = formData;//access
                const transactionsContract = getEthereumContract();
                console.log(transactionsContract);
                //calculate curent transactions
                const parsedAmount = ethers.utils.parseEther(amount);      
                await ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: "0x5208",//21000 GWEI currently ₦28.21
                    value: parsedAmount._hex, //0.0001
                }],
                });
                
                //store transaction 
                const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
                
                //enable loader for transactions
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
        //afterwards call all functions
        checkIfWalletIsConnected();
        //check current number of transactions
        checkIfTransactionsExist();
    },[])

    return (
        <TransactionContext.Provider value={{connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction, transactions, isLoading}}>
            {children}
        </TransactionContext.Provider>
    )
}