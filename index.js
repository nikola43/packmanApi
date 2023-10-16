const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const ethers = require('ethers');
const packmanAbi = require('./packmanAbi.json');

dotenv.config();
const app = express();
app.use(express.json())    // <==== parse request body as JSON

const packmanAddress = "0x0000fF0d724a25FBBcB1504642CF1713D3c13fac"
const pvkey = process.env.PRIVATE_KEY;

const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/polygon_mumbai");
const wallet = new ethers.Wallet(pvkey, provider)
const packmanContract = new ethers.Contract(packmanAddress, packmanAbi, wallet);

app.use(cors({
    //origin: 'https:website.com'
    origin: '*'
}));

app.get('/', async (req, res) => {
    res.send("Hello World");
})

app.get('/getHighScore', async (req, res) => {
    const highScoreBN = await packmanContract.highScore();
    const highScore = ethers.utils.formatEther(highScoreBN)
    res.send({ highScore: Math.abs(parseFloat(highScore)) });
})

app.get('/getRanking', async (req, res) => {
    const ranking = await packmanContract.getRanking();
    res.send({ ranking });
})

app.post('/updateWinnerScore', async (req, res) => {
    const winnerAddress = req.body.winnerAddress;
    const winnerScore = req.body.winnerScore;
    console.log(winnerAddress, winnerScore);

    try {
        const tx = await packmanContract.setPlayerScore(winnerAddress, winnerScore);
        res.send({ tx: tx.hash });
    } catch (error) {
        res.send(error.toString());
    }
})

app.listen(3000, () => {
    console.log("Server running on port 3000");
})
