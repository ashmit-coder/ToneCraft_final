import "./Card.css";
import { ethers } from "ethers"
function Card({item}){
    const colorTable=["linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)",
    "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
    "linear-gradient(to right, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(to top, #f43b47 0%, #453a94 100%)"
]
    return(
        <div className="carding col" style={{marginTop:"20px"}}>
            <div className="randomColor" style={{backgroundImage:colorTable[Math.floor(Math.random() * 5)]}}></div>
            <div className="test">
            <div style={{display:"flex",alignItems:"baseline",gap:"20px"}}> 
                <p>{item.name}</p>
                <img src="tick-mark.png" style={{height:"20px",width:"20px"}}></img>
            </div>
            <span style={{color:"white",marginLeft:"17px",marginBlock:"-5px"}}>Price</span>
            <span className="s2">{ethers.utils.formatEther(item.totalPrice)}  ETH</span>
            </div>

        </div>
    )
};
export default Card;