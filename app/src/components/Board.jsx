import React from 'react';

const Board = ({ board, onMove }) => {
    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)', gap: '5px' }}>
                {board.map((value, index) => (
                    <button
                        key={index}
                        style={{ width: '100px', height: '100px', fontSize: '24px' }}
                        onClick={() => onMove(index)}
                        disabled={value !== null}
                    >
                        {value}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Board;
