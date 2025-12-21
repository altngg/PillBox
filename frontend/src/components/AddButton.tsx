import React from 'react';
import './AddButton.css';

interface AddButtonProps {
  onClick?: () => void;
}

export const AddButton: React.FC<AddButtonProps> = ({ onClick }) => {
  return (
    <div className="add-medicine-button">
      <button onClick={onClick}>+</button>
    </div>
  );
};