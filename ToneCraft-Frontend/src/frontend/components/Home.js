import { useState, useEffect } from 'react'
import "./Home.css";
import { ethers } from "ethers"
import { Row, Col, Card, Button } from 'react-bootstrap'
const Home = ({ marketplace, nft}) => {
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])
  const loadMarketplaceItems = async () => {
    // Load all unsold items
    const itemCount = await marketplace.itemCount()
    let items = []
    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.items(i)
      if (!item.sold) {
        // get uri url from nft contract
        console.log(item.tokenId);
        const uri = await nft.tokenURI(item.tokenId);
        console.log(uri);
        // use uri to fetch the nft metadata stored on ipfs 
        const response = await fetch(uri)
        const metadata = await response.json()
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(item.itemId)
        // console.log(metadata.image);
        // console.log(metadata.image.config.url);
        // Add item to items array
        items.push({
          totalPrice,
        itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.url
        })
      }
    }
    setLoading(false)
    setItems(items)
  }

  const buyMarketItem = async (item) => {
    await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
    loadMarketplaceItems()
  }
 
  useEffect(async () => {
    const itemCount = await marketplace.itemCount();
     
      await loadMarketplaceItems()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (
    <div className="container">
      {items.length > 0 ?
        <div className="px-5 container row row-cols-4 gap-4" style={{marginBottom:"30px"}}>
          {/* <Row xs={1} md={2} lg={4} Name="g-4 py-5"> */}
            {items.map((item, idx) => {
              // if(item.price!==undefined){
              // ========
              // =======
              // ------------
              return(
              <Col key={idx} className="overflow-hidden">
                <Card className="cardLayout">
                  <audio className="audioPlayer " src={item.image} controls controlsList="nodownload"></audio>
                  {/* <Card.Img variant="top" src={item.image} /> */}
                  <Card.Body className=" bg-dark">
                    <Card.Title className="text-light fw-bold">{item.name}</Card.Title>
                    <Card.Text className="text-light fw-bold">
                      {item.description}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="bg-dark">
                    <div className='d-grid'>
                      <Button className="bg-primary-subtle" onClick={() => buyMarketItem(item)} variant="primary" size="lg">
                        Buy for <span className='fw-bold'>{ethers.utils.formatEther(item.totalPrice)}</span> ETH
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>) //return
              // } //if
              // -----------
            }//change
            )}
          {/* </Row> */}
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2 style={{color:"white"}}>No listed assets</h2>
          </main>
        )}
        <div className='air air1'></div>
      <div className='air air2'></div>
      <div className='air air3'></div>
      <div className='air air4'></div>
    </div>
  );
}
export default Home