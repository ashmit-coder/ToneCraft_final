
# ToneCraft

ToneCraft is a web application designed to transform PDF books into realistic audiobooks, offering an immersive and accessible reading experience through audio.

## Table of Content
1. [How it Works](##How-it-Works)
2. [Features](#Features)
3. [Run Locally](#Run-Locally)
4. [Demo](#Demo)
5. [License](#License)

## How it Works
The books, in PDF format, undergo preprocessing using ML/DL libraries, while simultaneously undergoing emotion analysis. Through emotional analysis, the PDF is segmented into chunks, each associated with a specific emotion. These emotion-tagged segments are then transformed into audio files using Amazon Polly web services, incorporating appropriate tone, pitch, speed, and emphasis to sound like human voices.

The PDF from the local device can be accessed on the NFT Marketplace. The NFT Marketplace serves as storage for the audio files in the form of NFTs, which can be purchased by the public using Ethereum coins via the MetaMask wallet. Once the NFT is purchased, it is removed from the NFT Marketplace, eliminating the possibility of piracy. The use of NFTs establishes a transparent and secure layer between the buyer and the seller, preventing any third party from altering the purchase and creating a more secure platform for authors to publish their books.
## Features
- Emotion Analysis: PDFs are divided into segments based on emotional content.
- Audio Generation: Amazon Polly converts emotion-tagged segments into realistic audiobook segments.
- NFT Marketplace Integration: Upload PDFs from your local device to the NFT Marketplace.
- Secure Audio Storage: Audio files are stored as NFTs, accessible for purchase with Ethereum coins via the MetaMask wallet.
- Secure Audio Storage: Audio files are stored as NFTs, accessible for purchase with Ethereum coins via the MetaMask wallet.
- Zero Piracy Risk: Once an NFT is purchased, it is removed from the marketplace, ensuring no unauthorized distribution.
- Transparency and Security: NFTs establish a transparent and secure platform for authors, preventing any third-party alterations to purchases.

## Run Locally
Clone the Project
```bash
git clone https://github.com/manasagar/ToneCraft_final.git
cd ToneCraft_final
```

#### Run ML Server
```bash
cd ToneCraft-ML
```
```bash
Pip install -r requirements.txt
```
```bash
Uvicorn ToneCraft:app --reload
```

#### Run Node Server ( Backend )
```bash
cd ToneCraft-Backend
```
```bash
npm install
```
```bash
npm run dev
```

#### Run React Server ( Frontend )
```bash
cd ToneCraft-Frontend
```
```bash
npm install
```
```bash
npm run start
```


 
## Demo
Check out our demo [here](https://youtu.be/vNx6jiw8zbo?si=wTc2LfKsuN3y8s-t)



## License
This project is licensed under the 
[MIT Licence](https://github.com/manasagar/ToneCraft_final/blob/main/LICENSE)

