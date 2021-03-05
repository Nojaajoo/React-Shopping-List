import {useState, useEffect} from "react";
import './App.css';

const URL = "http://localhost/shoppinglist/";

function App() {
  const [item, setItem] = useState(""); // variables for adding items
  const [amount, setAmount] = useState("")
  const [items, setItems] = useState([]); // variable for rendering shopping list

  function add(e) {
    e.preventDefault();
    let status = 0;
    fetch( URL + "add.php", {
      method: 'POST',
      headers: {
      	'Accept': 'application/json',
      	'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      	description: item,
        amount: amount
      })
    })
    .then(res => {
      status = parseInt(res.status);
      return res.json()
    })
    .then(
      (res) => {
      	if (status === 200) {
      	  setItems(items => [...items, res]);
          setItem("");
          setAmount("");
      	} else {
      	  alert(res.error)
      	}
      }, (error) => {
      	alert(error);
      }
    )
  }

  useEffect(() => {
    fetch(URL + "index.php")
    .then(response => response.json())
    .then(
      (response) => {
        setItems(response);
      }, (error) => {
        alert(error);
      }
    )
  }, [])

  return (
    <div className="App">
      <h2>Shopping List</h2>
      <div className="UI" >
        <form onSubmit={add}>
          <label>New Item:</label>&nbsp;
          <input id="input_item" placeholder="Write item description" value={item} onChange={e => setItem(e.target.value)} />&nbsp;
          <input id="input_amount" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />&nbsp;
          <button id="add">Add to List</button>
        </form>
      </div>
      <div className="list" >
        <table style={{width: "100%"}} >
          <colgroup>
            <col span="1" style={{width: "60%"}} />
            <col span="1" style={{width: "20%"}} />
            <col span="1" style={{width: "20%"}} />
          </colgroup>
          <tbody>
            <tr>
              <th>Item</th>
              <th>Amount</th>
              <th></th>
            </tr>
            {items.map((item, i) => (
            <tr key={item.id} >
              <td className="itemdesc" >&nbsp;&nbsp;&nbsp;{item.description}</td>
              <td className="itemamount">{item.amount}</td>
              <td><a className="delete" href="#">Delete</a></td> 
            </tr>
          ))}
          </tbody>
          
          
        </table>
        {/* <ol>
          {items.map(item => (
            <li key={item.id} ><span className="itemdesc">{item.description}</span>&nbsp;<span className="itemamount">{item.amount}</span></li>
          ))}
        </ol> */}
      </div>
    </div>
  );
}

export default App;
// onClick={() => remove.(item.id)}