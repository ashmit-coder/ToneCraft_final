import Navigation from './Navbar';
import "./LandingPage.css";
function LandingPage({ web3Handler, account }){
    return(
        <div className="landingPage">
         {/* <Navigation web3Handler={web3Handler} account={account} />    */}
        <div className="subLanding">
        <img className="hero_image" src="./newAsset.png"></img>
        <span>Tone Craft Hub</span>
        </div>
        <div className="area" >
            <ul className="circles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
            </ul>
    </div >
        </div>     
    )
}
export default LandingPage;