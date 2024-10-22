
import React, { useState } from 'react';
const WordSelectionModal = ({ words, onClose, onSelect }) => {
    const [selectedWord, setSelectedWord] = useState(null);
  
    const handleSelect = (word) => {
      setSelectedWord(word);
      onSelect(word);
      onClose();
    };
  
    const handleConfirm = () => {
      if (selectedWord) {
        onSelect(selectedWord);
        onClose();
      } else {
        alert("Please select a word");
      }
    };
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="fixed inset-0 bg-gray-900 opacity-50" onClick={onClose}></div>
        <div className="bg-white p-6 rounded-lg shadow-lg z-10 w-1/3">
          <h2 className="text-lg font-bold mb-4">Select a Word</h2>
          <div className="space-y-2">
            {words.map((word, index) => (
              <button
                key={index}
                className={`block w-full text-left px-4 py-2 rounded-md cursor-pointer 
                  ${selectedWord === word ? 'bg-blue-500 text-white' : 'bg-gray-100'}
                  hover:bg-gray-200`}
                onClick={() => handleSelect(word)}
              >
                {word}
              </button>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-400"
              onClick={onClose}
            >
              Close
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={handleConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default WordSelectionModal;