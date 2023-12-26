import { useState, useEffect } from "react";
import "./App.css";
import Auth from "./components/Auth";
import { db, auth, storage } from "./config/firebase";
import {
 getDocs,
 doc,
 collection,
 addDoc,
 deleteDoc,
 updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

function App() {
 const [moviesList, setMoviesList] = useState([]);
 const [updateMode, setUpdateMode] = useState(false);
 const [movieId, setMovieId] = useState("");
 const [movieTitle, setMovieTitle] = useState("");
 const [movieReleaseDate, setMovieReleaseDate] = useState("");
 const [movieReceivedAnOscar, setMovieReceivedAnOscar] = useState(false);
 const [movieImage, setMovieImage] = useState(null);
 const movieCollection = collection(db, "movies");
 const [isLoggedIn, setIsLoggedIn] = useState(false);
 const checkLoggedIn = () => {
  if (auth?.currentUser !== null) {
   setIsLoggedIn(true);
  } else {
   setIsLoggedIn(false);
  }
 };
 useEffect(() => {
  checkLoggedIn();
 }, [auth?.currentUser]);
 useEffect(() => {
  getMovies();
 }, []);
 const getMovies = async () => {
  try {
   const data = await getDocs(movieCollection);
   const filteredData = data.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
   }));
   setMoviesList(filteredData);
   console.log(filteredData);
  } catch (error) {
   console.error(error);
  }
 };
 // add new movie function
 const addMovie = async () => {
  if (isLoggedIn) {
   try {
    if (
     auth?.currentUser !== null &&
     movieTitle !== "" &&
     movieReleaseDate !== 0
    ) {
     var image_path = "";
     if (movieImage) {
      image_path = `projectFiles/${uuidv4()}`;
     }
     await addDoc(movieCollection, {
      title: movieTitle,
      releaseDate: movieReleaseDate,
      receivedAnOscar: movieReceivedAnOscar,
      userId: auth.currentUser.uid,
      image_path: image_path,
      // image:
     });
     if (movieImage) uploadImage(ref(storage, image_path));
     getMovies();
     clearInputs();
     alert("new movie added successfully");
    } else {
     alert("Movie Title And Release Date Required");
    }
   } catch (error) {
    console.error(error);
   }
  }
 };
 // update movie function
 const updateMovie = async () => {
  if (isLoggedIn) {
   try {
    const moiveDoc = doc(db, "movies", movieId);
    await updateDoc(moiveDoc, {
     title: movieTitle,
     releaseDate: movieReleaseDate,
     receivedAnOscar: movieReceivedAnOscar,
     userId: auth.currentUser.uid,
    });
    getMovies();
    clearInputs();
    alert("movie updated successfully");
   } catch (error) {
    console.error(error);
   }
  }
 };
 // delete movie function
 const deleteMovie = async (id) => {
  if (isLoggedIn) {
   try {
    const moiveDoc = doc(db, "movies", id);
    await deleteDoc(moiveDoc);
    getMovies();
    alert("movie deleted successfully");
   } catch (error) {
    console.error(error);
   }
  }
 };
 // upload image
 const uploadImage = async (image_path) => {
  if (!movieImage) return false;
  try {
   await uploadBytes(image_path, movieImage);
  } catch (error) {
   console.error(error);
  }
 };
 // update inputs
 const updateInputs = (id) => {
  setUpdateMode(true);
  const moiveDoc = moviesList.find((obj) => obj.id === id);
  setMovieId(id);
  setMovieTitle(moiveDoc.title);
  setMovieReleaseDate(moiveDoc.releaseDate);
  setMovieReceivedAnOscar(moiveDoc.receivedAnOscar);
 };
 // clear inputs
 const clearInputs = () => {
  setUpdateMode(false);
  setMovieId("");
  setMovieTitle("");
  setMovieReleaseDate("");
  setMovieReceivedAnOscar(false);
  setMovieImage(null);
 };
 return (
  <div className="App">
   <Auth />
   <br />
   <br />

   {isLoggedIn && (
    <div className="container">
     <h1>Movie Form</h1>
     <input
      type="text"
      placeholder="Movie Title..."
      value={movieTitle}
      onChange={(e) => setMovieTitle(e.target.value)}
     />
     <input
      type="text"
      placeholder="Release Date..."
      value={movieReleaseDate}
      onChange={(e) => setMovieReleaseDate(e.target.value)}
     />
     <input
      type="checkbox"
      id="receivedAnOscar"
      checked={movieReceivedAnOscar}
      value={movieReceivedAnOscar}
      onChange={(e) => setMovieReceivedAnOscar(e.target.checked)}
     />{" "}
     <label htmlFor="receivedAnOscar">Received An Oscar</label>
     <input type="file" onChange={(e) => setMovieImage(e.target.files[0])} />
     <br />
     <br />
     {!updateMode && <button onClick={addMovie}>Add New Movie</button>}
     {updateMode && (
      <div>
       <button onClick={updateMovie}>Update Movie</button>
       <button onClick={clearInputs}>Cancel</button>
      </div>
     )}
    </div>
   )}

   <br />
   <br />

   {moviesList.length > 0 && (
    <div className="container">
     <h1>Movies List</h1>
     <table border={1}>
      <thead>
       <tr>
        <th>Title</th>
        <th>Release Date</th>
        {isLoggedIn && <th>update</th>}
        {isLoggedIn && <th>Delete</th>}
       </tr>
      </thead>
      <tbody>
       {moviesList.map((movie, index) => {
        return (
         <tr key={index}>
          <td style={{ color: movie.receivedAnOscar ? "green" : "red" }}>
           <h1>{movie.title}</h1>
          </td>
          <td>{movie.releaseDate}</td>

          {isLoggedIn && (
           <td>
            <button onClick={() => updateInputs(movie.id)}>Update</button>
           </td>
          )}
          {isLoggedIn && (
           <td>
            <button onClick={() => deleteMovie(movie.id)}>Delete</button>
           </td>
          )}
         </tr>
        );
       })}
      </tbody>
     </table>
    </div>
   )}
  </div>
 );
}

export default App;
