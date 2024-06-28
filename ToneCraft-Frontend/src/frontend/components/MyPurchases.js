import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import Card from "./Card.js";
export default function MyPurchases({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true)
  const [purchases, setPurchases] = useState([])
  const loadPurchasedItems = async () => {
    // Fetch purchased items from marketplace by quering Offered events with the buyer set as the user
    const filter =  marketplace.filters.Bought(null,null,null,null,null,account)
    const results = await marketplace.queryFilter(filter)
    //Fetch metadata of each nft and add that to listedItem object.
    const purchases = await Promise.all(results.map(async i => {
      // fetch arguments from each result
      i = i.args
      // get uri url from nft contract
      const uri = await nft.tokenURI(i.tokenId)
      // use uri to fetch the nft metadata stored on ipfs 
      const response = await fetch(uri)
      const metadata = await response.json()
      // get total price of item (item price + fee)
      const totalPrice = await marketplace.getTotalPrice(i.itemId)
      // define listed item object
      let purchasedItem = { 
        totalPrice,
        price: i.price,
        itemId: i.itemId,
        name: metadata.name,
        description: metadata.description,
        image: metadata.image
      }
      return purchasedItem
    }))
    setLoading(false)
    setPurchases(purchases)
  }
  useEffect(() => {
    loadPurchasedItems()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2 style={{color:"white"}}>Loading...</h2>
    </main>
  )
  return (
    <div className="container" style={{marginBottom:"30px"}}>
      {purchases.length > 0 ?
        <div className="px-5 row row-cols-3 gap-3">
          {/* <Row xs={1} md={2} lg={4} className="g-4 py-5"> */}
            {purchases.map((item, idx) => (
              <Card item={item}></Card>
              // <Col key={idx} className="overflow-hidden">
              //   <Card>
              //     <Card.Img variant="top" src={item.image} />
              //     <Card.Footer>{ethers.utils.formatEther(item.totalPrice)} ETH</Card.Footer>
              //   </Card> 
              // </Col>
            ))}
          {/* </Row> */}
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2 style={{color:"white"}}>No purchases</h2>
          </main>
        )}
    </div>
  );
}