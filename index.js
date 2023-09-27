const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const ethers = require('ethers');
const packmanAbi = require('./packmanAbi.json');

dotenv.config();
const app = express();
app.use(express.json())    // <==== parse request body as JSON

const packmanAddress = "0x5b86F39d4333d6825b1a038C438a5753AB056247"
const pvkey = process.env.PRIVATE_KEY;

const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/polygon_mumbai");
const wallet = new ethers.Wallet(pvkey, provider)
const packmanContract = new ethers.Contract(packmanAddress, packmanAbi, wallet);

app.use(cors({
    //origin: 'https:website.com'
    origin: '*'
}));

app.get('/', async (req, res) => {
    let score = 0;
    try {
        score = await packmanContract.highScore();
        console.log(score);
    } catch (error) {
        console.log(error);
        res.send(error);
    }

    res.send(score.toString());
})

app.post('/updateWinnerScore', async (req, res) => {
    const winnerAddress = req.body.winnerAddress;
    const winnerScore = req.body.winnerScore;
    console.log(winnerAddress, winnerScore);

    try {
        const tx = await packmanContract.updateWinnerScore(winnerAddress, winnerScore);
        res.send({tx: tx.hash});
    } catch (error) {
        res.send(error.toString());
    }
})

app.listen(3000, () => {
    console.log("Server running on port 3000");
})