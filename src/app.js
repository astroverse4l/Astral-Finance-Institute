const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const routes = require('./routes');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes);

// Serve static files from the public folder
app.use(express.static('public'));

// Root route with embedded HTML
app.get('/', (req, res) => {
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AstroVerse</title>
            <link rel="stylesheet" href="styles.css">
            <style>
                /* General Styles */
                body {
                    margin: 0;
                    font-family: 'Arial', sans-serif;
                    color: #fff;
                    background-color: #000;
                    overflow-x: hidden;
                }

                h1, h2, h3, p {
                    text-align: center;
                    margin: 20px 0;
                }

                /* Parallax Section */
                .parallax {
                    position: relative;
                    background-attachment: fixed;
                    background-size: cover;
                    background-position: center;
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .parallax-1 {
                    background-image: url('damned.jpg');
                }

                .parallax-2 {
                    background-image: url('float.jpg');
                }

                /* Text Overlay */
                .overlay {
                    background: rgba(0, 0, 0, 0.6);
                    padding: 20px;
                    border-radius: 10px;
                }

                .overlay h1, .overlay h2, .overlay p {
                    margin: 10px 0;
                }

                /* Scroll Effects */
                .content {
                    padding: 50px;
                    background: #111;
                }

                .content h2 {
                    font-size: 2rem;
                }

                .content p {
                    font-size: 1.2rem;
                    line-height: 1.6;
                }

                /* API Documentation Section */
                .api-docs {
                    background: #222;
                    padding: 50px;
                    border-top: 2px solid #444;
                }

                .api-docs h2 {
                    font-size: 2rem;
                    color: #00ffcc;
                }

                .api-docs pre {
                    background: #333;
                    padding: 20px;
                    border-radius: 5px;
                    overflow-x: auto;
                    color: #00ffcc;
                }
            </style>
        </head>
        <body>
            <!-- Parallax Section 1 -->
            <div class="parallax parallax-1">
                <div class="overlay">
                    <h1>Welcome to AstroVerse</h1>
                    <p>Your gateway to Web3, NFTs, Gaming, and Crypto Education.</p>
                </div>
            </div>

            <!-- Introduction Section -->
            <div class="content">
                <h2>About AstroVerse</h2>
                <p>AstroVerse is a cutting-edge platform that combines the power of Web3 technologies with education, gaming, and community engagement. Explore the world of NFTs, smart contracts, and decentralized finance while connecting with like-minded individuals in our forums.</p>
                <p>Our mission is to empower developers, gamers, and enthusiasts to build and learn in the decentralized ecosystem.</p>
            </div>

            <!-- Parallax Section 2 -->
            <div class="parallax parallax-2">
                <div class="overlay">
                    <h2>Explore the Cosmos of Web3</h2>
                    <p>From NFT gaming to real-time crypto price updates, AstroVerse has it all.</p>
                </div>
            </div>

            <!-- API Documentation Section -->
            <div class="api-docs">
                <h2>API Documentation</h2>
                <p>AstroVerse provides seamless integrations with popular Web3 frameworks and tools:</p>
                <pre>
1. Unity and Unreal Engine:
   - Integrate blockchain functionality into your games.
   - Use our SDK for NFT-based assets and in-game economies.

2. Solidity and Hardhat:
   - Deploy and test smart contracts with ease.
   - Access prebuilt templates for ERC-20 and ERC-721 tokens.

3. ethers.js and web3.js:
   - Interact with Ethereum blockchain and smart contracts.
   - Fetch real-time data and execute transactions.

4. Support for Other Frameworks:
   - Compatible with Moralis, Alchemy, and The Graph.
   - Extend functionality with Chainlink oracles.
                </pre>
                <p>For detailed guides and examples, visit our <a href="/docs" style="color: #00ffcc;">documentation page</a>.</p>
            </div>
        </body>
        </html>
    `;
    res.send(htmlContent);
});

module.exports = app;