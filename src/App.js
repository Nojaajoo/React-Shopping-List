import {useState, useEffect} from "react";
import './App.css';
// poisto napin/linkin kuvake fontawesomesta
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const deletebutton = <FontAwesomeIcon icon={faTrashAlt} />

const URL = "http://localhost/shoppinglist/";

function App() {
  const [item, setItem] = useState(""); // variables for adding items
  const [amount, setAmount] = useState("")
  const [items, setItems] = useState([]); // variable for rendering shopping list

//lisäys listalle
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
// poisto listalta
  function remove(id) {
    let status = 0;
    fetch( URL + "/remove.php" ,{
      method: 'POST',
      headers: {
      	'Accept': 'application/json',
      	'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      	id: id
      })
    })
    .then(res => {
      status = parseInt(res.status);
      return res.json()
    })
    .then(
      (res) => {
      	if (status === 200) {
      	const newListWithoutRemoved = items.filter((item) => item.id !== id);
        setItems(newListWithoutRemoved);
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
      <h2 className="otsikko" >SHOPPING LIST</h2>
      
        <form onSubmit={add}>
          <div className="form">
            <label>New Item:</label>&nbsp;
            <input id="input_item" placeholder="Write item description" 
              value={item} onChange={e => setItem(e.target.value)} />&nbsp;
            <input id="input_amount" placeholder="Amount" 
              value={amount} onChange={e => setAmount(e.target.value)} />&nbsp;
            <button id="add">Add to List</button>
          </div>
        </form>
      
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
            {items.map((item, i) => ( // yritin saada conditional styling niin, että alimman rivin reunat pyöristyisi, en saanut kuitenkaan toimimaan uusia rivejä lisätessä
            <tr key={item.id} >
              <td style={items.length -1 === i ? {borderBottomLeftRadius: "15px"} : {} }
                className="itemdesc" >&nbsp;&nbsp;&nbsp;{item.description}</td>
              <td className="itemamount">{item.amount}</td>
              <td style={items.length -1 === i ? {borderBottomRightRadius: "15px", textAlign: "right"} : {textAlign: "right"} } >
                <a onClick={() => remove(item.id)} className="delete" href="#">{deletebutton}</a>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;