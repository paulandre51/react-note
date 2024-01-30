// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Note from './Note';
import Sidebar from './Sidebar';
import { v4 as uuidv4 } from 'uuid';
import { SpinnerCircularFixed } from 'spinners-react';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [profiles, setProfile] = useState(null);
  const [search, setSearch] = useState('');

  async function fetchProfiles() {
    const response = await fetch("/profiles");
    const data = await response.json();

    setProfile(data.name);
  }

  const addNote = async () => {
    const newNote = { id: uuidv4(), title: 'Nouvelle note', content: 'Contenu de la nouvelle note' };

    // Ajouter la nouvelle note à la base de données
    await fetch("http://localhost:4000/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newNote),
    });

    // Mettre à jour l'état local avec la nouvelle note
    setNotes([newNote, ...notes]);
    setCurrentNote(newNote.id);
  };

  const deleteNote = async (id) => {
    // Afficher une boîte de dialogue de confirmation
    const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?');
  
    if (confirmDelete) {
      // Supprimer la note de la base de données
      await fetch(`http://localhost:4000/notes/${id}`, {
        method: "DELETE",
      });
  
      setNotes(notes.filter((note) => note.id !== id));
  
      setCurrentNote(null);
      console.log(`Note avec l'ID ${id} supprimée de la base de données.`);
    }
  };

  async function fetchNotes() {
    const response = await fetch("http://localhost:4000/notes");
    const data = await response.json();

    setNotes(data);
  }

  const saveCurrentNote = async () => {
    const currentNoteObj = notes.find((note) => note.id === currentNote);

    // Vérifier si la note actuelle existe et a été modifiée
    if (currentNoteObj) {
      await fetch(`http://localhost:4000/notes/${currentNote}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: currentNoteObj.title,
          content: currentNoteObj.content,
        }),
      });
      alert('Note actuelle sauvegardée avec succès !');
    } else {
      alert('Aucune note actuelle trouvée.');
    }
  };

  const currentNoteObj = notes.find(note => note.id === currentNote);
  const filteredNotes = notes.filter(note => note.title.includes(search) || note.content.includes(search));

  useEffect(function () {
    fetchNotes();
    fetchProfiles();
  }, []);

  const getNoteContent = (id, newText, type) => {
    setNotes(notes.map((note) => (note.id === id ? {
      ...note, [type]: newText
    } : note)));
  };

  if(!notes){
    return (
      <div className="spinner-container">
        <SpinnerCircularFixed size={50} thickness={180} speed={179} color="rgba(15, 79, 182, 1)" secondaryColor="rgba(0, 0, 0, 0.49)" />
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Bloc-notes</h1>
      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." />
      <div className="ProfileName">Welcome, {profiles}</div>
      <button onClick={addNote}>Nouvelle Note</button>
      <button onClick={saveCurrentNote}>Sauvegarder</button>

      <div className="note-container">
        <Sidebar notes={filteredNotes} setCurrentNote={setCurrentNote} onDelete={deleteNote} />
        <div className="current-note">
          {currentNote !== null && (
            <>
              <h2>Note actuelle</h2>
              <input type="text" value={currentNoteObj ? currentNoteObj.title : ''} onChange={(e) => getNoteContent(currentNote, e.target.value, 'title')} />

              <textarea value={currentNoteObj ? currentNoteObj.content : ''} onChange={(e) => getNoteContent(currentNote, e.target.value, 'content')} />

            </>
          )}
        </div>
      </div>
    </div>
  );

}

export default App;
