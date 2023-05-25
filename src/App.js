import logo from './logo.svg';
import './App.css';
import { Auth } from './components/auth';
import {db, auth, storage} from "./config/firebase"
import { useEffect, useState } from 'react';
import {getDocs, collection, addDoc, deleteDoc, doc, updateDoc} from "firebase/firestore"
import { ref, uploadBytes } from 'firebase/storage';
import { upload } from '@testing-library/user-event/dist/upload';


function App() {
  const [movieList, setMovieList] = useState([]);

  // New Movie States
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(true);

  //Update Title State
  const [updatedTitle, setUpdatedTite] = useState("");

  //File Upload State
  const[fileUpload, setFileUpload] = useState(null);

  const moviesCollectionRef = collection(db, "movies");

  const getMovieList = async () => {
    //READ THE DATA FROM DATABASE
    //SET THE MOVIELIST
    try { 
    const data = await getDocs(moviesCollectionRef);
    const filteredData = data.docs.map((doc) => 
    ({
      ...doc.data(),
      id: doc.id
    }));
    setMovieList(filteredData);

    } catch(err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMovieList();
  }, [])
  
  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle, 
        releaseDate: newReleaseDate, 
        receivedAnOscar: isNewMovieOscar, 
        userId:auth?.currentUser?.uid, 
      });
      getMovieList();
    } catch(err) {
      console.log(err);
    }
  };

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
  };

  const updateMovieTitle = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, {title: updatedTitle});
  };

  const uploadFile = async () => {
    if(!fileUpload) return;
    const fileFoldersRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(fileFoldersRef, fileUpload);
    } catch(err) {
      console.log(err);
    }
  }


  return (
   <>
   <div>
      <input type="text" placeholder='Movie title...' onChange={(e) => setNewMovieTitle(e.target.value)} />
      <input type="number" placeholder='Release Date...' onChange={(e) => setNewReleaseDate(Number(e.target.value))} />
      <input type="checkbox" onChange={(e) => setIsNewMovieOscar(e.target.checked)} checked={isNewMovieOscar}/>
      <label htmlFor="">Received an oscar</label>
      <button type='submit' onClick={onSubmitMovie}>Submit Movie</button>
   </div>
    <div className="App">
      <Auth/>
      <div>
        {movieList.map((movie) => (
          <div>
            <h1 style={{color:movie.receivedAnOscar? "green": "red"}}>{movie.title}</h1>
            <p>Date: {movie.releaseDate}</p>
            <button onClick={() => deleteMovie(movie.id)}>Delete movie</button>
            <input type="text" placeholder='New title...' onChange={(e) => setUpdatedTite(e.target.value)}/>
            <button onClick={() => updateMovieTitle(movie.id)}>update title</button>
          </div>
        ))}
      </div>
    <div>
        <input type="file" onChange={(e) => setFileUpload(e.target.files[0])} />
        <button onClick={uploadFile}>Upload File</button>
    </div>
    </div>

    </>
  );
}

export default App;
