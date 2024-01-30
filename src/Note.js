// Note.js
import React from 'react';

const   Note = ({ note, setCurrentNote, onDelete }) => {
  return (
    <div className="note" onClick={() => setCurrentNote(note.id)}>
      <div>{note.title}</div>
      <button className="delete-button" onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}>
        <i className="fas fa-trash-alt"></i>
      </button>
    </div>
  );
};

export default Note;
