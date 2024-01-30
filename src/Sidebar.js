// Sidebar.js
import React from 'react';
import Note from './Note';

const Sidebar = ({ notes, setCurrentNote, onDelete }) => {
  return (
    <div className="sidebar">
      <h2>Notes</h2>
      {notes.map((note) => (
        <Note key={note.id} note={note} setCurrentNote={setCurrentNote} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default Sidebar;
