import {
    Link
} from "react-router-dom";
import { Navbar, Nav, Button, Container } from 'react-bootstrap'
import market from './market.png'

const Navigation = ({ web3Handler, account }) => {
    return (
        <Navbar className="navbar">
            <Container>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                <Nav.Link as={Link} to="/"><img style={{width:"40px",height:"30px",scale:"2.8"}} src="./logo2.png"></img></Nav.Link>
                    <Nav className="me-auto"> 
                        <Nav.Link as={Link} to="/buy"><span className="navIncons">Buy</span></Nav.Link>
                        <Nav.Link as={Link} to="/create"><span className="navIncons">Sell</span></Nav.Link>
                        {/* <Nav.Link as={Link} to="/my-listed-items"><span className="navIncons">My Listed Items</span></Nav.Link>
                        <Nav.Link as={Link} to="/my-purchases"><span className="navIncons">My Purchases</span></Nav.Link> */}
                    </Nav>
                    <Nav> 
                        {account ? (
                            <Nav.Link
                                href={`https://etherscan.io/address/${account}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button nav-button btn-sm mx-4">
                                <Button variant="outline-warning">
                                     <span className="fw-bold">
                                          {account.slice(0, 5) + '...' + account.slice(38, 42)}
                                    </span>
                                </Button>

                            </Nav.Link>
                        ) : (
                            <Button onClick={web3Handler} variant="outline-warning" ><span className="fw-bold">Connect Wallet</span></Button>
                        )}
                    </Nav>
                    <Nav>                       
                         <Nav.Link as={Link} to="/profile"><img className="profileImage" src="./user-icon.png"></img></Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )

}

export default Navigation;