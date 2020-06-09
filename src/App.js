import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    photo: '',
    email: '',
    password:'',
    isValid:false,
    error:'',
    existingUser:false
  })
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const { displayName, photoURL, email } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          photo: photoURL,
          email: email
        }
        setUser(signedInUser);
        //console.log(displayName, email, photoURL);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);

      })

  }
  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          photo: '',
        }
        setUser(signedOutUser);


      })
      .catch(err => {
        console.log(err);
      })


    // console.log("signOUt");

  }
  //perform validation
  const is_valid_email = email =>   /(.+)@(.+){2,}\.(.+){2,}/.test(email); 
  const  hasNumber=input => /\d/.test(input);

  //fuction for checkbox if user has old account 26.11
  const switchForm = event =>{
    const creatUser ={...user};
          creatUser.existingUser=event.target.checked;
          setUser(creatUser);
          // console.log(event.target.checked);


  }

  //if user have already accound 26.13
  const signInUser = event =>{
    if(user.isValid){
      firebase.auth().signInWithEmailAndPassword(user.email,user.password)
      .then(res =>{
        console.log(res);
        const creatUser ={...user};
        creatUser.isSignedIn=true;
        creatUser.error ='';
        setUser(creatUser);
      })
      .catch(err =>{
        console.log(err.message);
        const creatUser ={...user};
        creatUser.isSignedIn=false;
        creatUser.error =err.message
        setUser(creatUser);
      })

      // console.log(user.email,user.password);
    }
    
      event.preventDefault();
      event.target.reset();

  }
  
  //event for taking input value
  
  const handleInput = (e)=>{
    
    const newUserInfo = {
      ...user,
      

    }
 
    //perform validation
    let isValid =true;
    if(e.target.name==="email"){
      isValid=(is_valid_email(e.target.value));

    }
    if(e.target.name ==="password" ){
        isValid =e.target.value.length>8 && hasNumber(e.target.value);

    } 
    newUserInfo[e.target.name]=e.target.value 
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
    //console.log(newUserInfo);
    // console.log(e.target.name,e.target.value);

  }
  
  const handleCreateUser =(event)=>{
    //create new account by passing the user email and password 26.11
    if(user.isValid){
      firebase.auth().createUserWithEmailAndPassword(user.email,user.password)
      .then(res =>{
        console.log(res);
        const creatUser ={...user};
        creatUser.isSignedIn=true;
        creatUser.error ='';
        setUser(creatUser);
      })
      .catch(err =>{
        console.log(err.message);
        const creatUser ={...user};
        creatUser.isSignedIn=false;
        creatUser.error =err.message
        setUser(creatUser);
      })

      // console.log(user.email,user.password);
    }
    event.preventDefault();
    event.target.reset();

    
  }

  return (<div className="App" > 
        {
        (user.isSignedIn) ? <button onClick={handleSignOut}> Sign Out </button>
            : <button onClick={handleSignIn} > Sign in </button>
        } 
        {
          user.isSignedIn && <div>
          
                <p> Welcome to {user.name} </p> 
                <p> your Email: {user.email} </p>
                <img src={user.photo} alt=""/>
                </div>

        }
        <h1>This is our Authentication</h1> 
        <input type="checkbox" name="switchForm" onChange={switchForm} id="switchForm"/>
        <label htmlFor="switchForm"> Have already account?</label>
        <form style={{display:user.existingUser?'block':'none'}} onSubmit={signInUser}> 
        <br/>
        <input onBlur={handleInput} type="text" name="email" placeholder="Enter your email" required/>
        <br/>
        <input onBlur={handleInput} type="password" name="password" placeholder="enter your password" id="" required/>
        <br/>
        <input type="submit" value ="sign In"/>
        </form>
        <form style={{display:user.existingUser?'none':' '}} onSubmit={handleCreateUser}>
        <input onBlur={handleInput} type="text" name="name" placeholder="Enter your name" required/>
        <br/>
        <input onBlur={handleInput} type="text" name="email" placeholder="Enter your email" required/>
        <br/>
        <input onBlur={handleInput} type="password" name="password" placeholder="enter your password" id="" required/>
        <br/>
        <input type="submit" value ="create account"/>
        </form>
        {
          user.error && <p style={{color:"red"}}>{user.error}</p>
        }


        
        </div>
    );
}

export default App;