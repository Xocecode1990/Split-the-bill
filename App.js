import { useState } from "react";
import { uuid } from "uuid"; // Import v4 from uuid


const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return <button className="button" onClick={onClick}>{children}</button>
}
export default function App() {
  const [showaddfriend, setShowaddfriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedid, setSetselectedid] = useState(null);

  function handleSelection(friend) {
    setSetselectedid(selectedid?.id === friend.id ? null : friend);
    setShowaddfriend(false);


  }


  function setHandlenewuser(friend) {
    setFriends((friends) => [...friends, friend])
    setShowaddfriend(false);

  }

  function handlesetShowaddfriend() {
    setShowaddfriend((showaddfriend) => !showaddfriend)

  }

  function handleSplitvalue(value) {
    setFriends((friends) => friends.map((friend) => friend.id === selectedid.id ? { ...friend, balance: friend.balance + value } : friend))
    setSetselectedid(null)
  }
  return (

    <div className="app">


      <div className="sidebar">
        <FriendList friends={friends} handleSelection={handleSelection} selectedid={selectedid} />
        {showaddfriend && <FormAddFriend setHandlenewuser={setHandlenewuser} />}
        <Button onClick={handlesetShowaddfriend}>{showaddfriend ? 'Close' : 'Add friend'}</Button>

      </div>
      {selectedid && <FormSplitBill selectedid={selectedid} handleSplitvalue={handleSplitvalue} />}
    </div>
  )
}


function FriendList({ friends, handleSelection, selectedid }) {

  return <ul>
    {friends.map((friend) => <Friend friend={friend} key={friend.id} handleSelection={handleSelection} selectedid={selectedid} />)}

  </ul>
}

function Friend({ friend, handleSelection, selectedid }) {
  const isselected = friend?.id === selectedid?.id
  return (
    <li className={isselected ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && <p className="red">You owe {friend.name} {Math.abs(friend.balance)}$</p>}
      {friend.balance > 0 && <p className="green"> {friend.name} owes you {Math.abs(friend.balance)}$</p>}
      {friend.balance === 0 && <p >You and {friend.name} are even</p>}
      <Button onClick={() => handleSelection(friend)}>{isselected ? 'Close' : 'Select'}</Button>
    </li>
  )
}

function FormAddFriend({ setHandlenewuser }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://i.pravatar.cc/48');

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newUser = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,

    }
    setHandlenewuser(newUser);
  }
  return <form className="form-add-friend" onSubmit={handleSubmit}>
    <label>🧍‍♂️ Friend name</label>
    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
    <label>🌍 Image URL</label>
    <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
    <Button>Add</Button>

  </form>
}
function FormSplitBill({ selectedid, handleSplitvalue }) {
  const [bill, setBill] = useState('')
  const [paybyuser, setPaybyuser] = useState('')
  const paybyfriend = bill ? bill - paybyuser : ''
  const [whoispaying, setWhoispaying] = useState('')

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paybyuser) return;
    handleSplitvalue(whoispaying === 'user' ? paybyfriend : -paybyuser)




  }

  return <form className="form-split-bill" onSubmit={handleSubmit} >
    <h2>Split a bill with {selectedid.name}</h2>
    <label>🧨Bill value</label>
    <input type="text" value={bill} onChange={e => setBill(+e.target.value)}></input>

    <label>🙎‍♂️Your expense</label>
    <input type="text" value={paybyuser} onChange={e => setPaybyuser(+e.target.value > bill ? paybyuser : +e.target.value)}></input>

    <label>🏃‍♂️{selectedid.name} expense</label>
    <input type="text" disabled value={paybyfriend}></input>

    <label>🤷‍♀️ Who is paying the bill </label>
    <select value={whoispaying} onChange={e => setWhoispaying(e.target.value)}>

      <option value='user'>You</option>
      <option value='friend'>{selectedid.name}</option>
    </select>
    <Button>Split bill</Button>


  </form>
}