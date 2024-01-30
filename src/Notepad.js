// src/Notepad.js
import React, { useState } from 'react';
import Note from './Note';
import Sidebar from './Sidebar';
import { v4 as uuidv4 } from 'uuid';

const Notepad = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);

  const addNote = () => {
    const newNote = { id: uuidv4(), text: 'Nouvelle note' };
    setNotes([...notes, newNote]);
    setCurrentNote(newNote.id);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
    setCurrentNote(null);
  };

  const updateNoteText = (id, newText) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, text: newText } : note)));
  };

  return (
    <div>
      <Sidebar notes={notes} onNoteClick={setCurrentNote} />
      <div>
        <h1>Notepad</h1>
        <button onClick={addNote}>Nouvelle Note</button>
        {currentNote !== null && (
          <Note
            id={currentNote}
            text={notes.find((note) => note.id === currentNote)?.text || ''}
            onDelete={deleteNote}
          />
        )}
        <textarea
          value={currentNote !== null ? notes.find((note) => note.id === currentNote)?.text || '' : ''}
          onChange={(e) => updateNoteText(currentNote, e.target.value)}
        />
      </div>
    </div>
  );
};

export default Notepad;
