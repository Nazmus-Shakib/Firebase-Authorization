import React, { useState } from "react";
import "./App.css";
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase.config";

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: "",
    email: "",
    photo: "",
  });

  const provider = new firebase.auth.GoogleAuthProvider();

  const handleSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((res) => {
        const { displayName, email, photoURL } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
        };
        setUser(signedInUser);
        console.log(displayName, email, photoURL);
      })
      .catch((err) => {
        console.log(err);
        console.log(err.message);
      });
  };

  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then((res) => {
        const signedOutUser = {
          isSignedIn: false,
          name: "",
          email: "",
          password: "",
          isValid: false,
          photo: "",
          err: "",
          existingUser: false,
        };
        setUser(signedOutUser);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        console.log(err.message);
      });
  };

  const isValidEmail = (email) => /(.+)@(.+){2,}\.(.+){2,}/.test(email);

  const hasNumber = (input) => /\d/.test(input);

  const switchForm = (event) => {
    const createdUser = { ...user };
    createdUser.existingUser = event.target.checked;
    createdUser.error = "";
    setUser(createdUser);
  };

  const handleChange = (event) => {
    const newUserInfo = {
      ...user,
    };
    //debugger;

    // perform validation
    let isValid = true;
    if (event.target.name === "email") {
      isValid = isValidEmail(event.target.value);
    }

    if (event.target.name === "password") {
      isValid = event.target.value.length > 8 && hasNumber(event.target.value);
    }

    newUserInfo[event.target.name] = event.target.value;
    newUserInfo.isValid = isValid;
    //console.log(newUserInfo);
    setUser(newUserInfo);
  };

  const createAccount = (event) => {
    if (user.isValid) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          console.log(res);
          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = "";
          setUser(createdUser);
        })
        .catch((err) => {
          console.log(err.message);
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser);
        });
    } else {
      console.log("Form isn't Valid", user);
    }

    event.preventDefault();
    event.target.reset();
  };

  const signInUser = (event) => {
    if (user.isValid) {
      firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          console.log(res);
          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = "";
          setUser(createdUser);
        })
        .catch((err) => {
          console.log(err.message);
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser);
        });
    }

    event.preventDefault();
    event.target.reset();
  };

  return (
    <div className="App">
      {user.isSignedIn ? (
        <button onClick={handleSignOut}>Sign Out</button> // short cut if else writing
      ) : (
        <button onClick={handleSignIn}>Sign In</button>
      )}

      {user.isSignedIn === true && (
        <div>
          <p>Welcome, {user.name}</p>
          <p>Your Email: {user.email}</p>
          <img src={user.photo} alt=""></img>
        </div>
      )}

      <h1>Our Authentication</h1>

      <input
        type="checkbox"
        name="Switch Form"
        onChange={switchForm}
        id="switchForm"
      />
      <label htmlFor="switchForm">Returning User</label>
      <form
        style={{ display: user.existingUser ? "block" : "none" }}
        onSubmit={signInUser}
      >
        <input
          type="text"
          onBlur={handleChange}
          name="email"
          placeholder="Your Email Account"
          required
        />
        <br />
        <input
          type="password"
          onBlur={handleChange}
          name="password"
          placeholder="Not less than 8 alphaNumeric"
          required
        />
        <br />
        <br />
        <input type="submit" value="Sign In" />
      </form>

      <form
        style={{ display: user.existingUser ? "none" : "block" }}
        onSubmit={createAccount}
      >
        <input
          type="text"
          onBlur={handleChange}
          name="name"
          placeholder="Your Name"
          required
        />
        <br />
        <input
          type="text"
          onBlur={handleChange}
          name="email"
          placeholder="Your Email Account"
          required
        />
        <br />
        <input
          type="password"
          onBlur={handleChange}
          name="password"
          placeholder="Not less than 8 alphaNumeric"
          required
        />
        <br />
        <br />
        <input type="submit" value="Create Account" />
      </form>

      {user.error && <p style={{ color: "red" }}>{user.error}</p>}
    </div>
  );
}

export default App;
