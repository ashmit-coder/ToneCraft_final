import {useState} from 'react';
import MyListedItems from './MyListedItems.js'
import MyPurchases from './MyPurchases.js'
function Profile({account,marketplace,nft}){
    const [field,setField]=useState(true);
    return(
        <div className="profilepage w-100 min-vh-100" >
            <div className="profileBox1" >
                <div className="profileBox2">
                    <div className="profileBox3"></div>
                    <span>{account.slice(0, 5) + '...' + account.slice(38, 42)}</span>
                </div>
            </div>
            <div className="dataBox">
                <div className="dataBoxButtons">
                    <button className={`class1 ${field?"selectedOne":""}`} onClick={()=>{setField(true)}}>Listed Items</button>
                    <button className={`class1 ${field?"":"selectedOne"}`} onClick={()=>{setField(false)}}>Purchased List</button>
                    </div>
                <div className='dataBox_line'></div>
                {field?( <MyListedItems marketplace={marketplace} nft={nft} account={account} />)
                :(<MyPurchases marketplace={marketplace} nft={nft} account={account} />)}
            </div>
        </div>
    )
};
export default Profile;