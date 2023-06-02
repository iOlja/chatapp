import React, { useState } from 'react';
import './App.css';
import 'remixicon/fonts/remixicon.css'


const Input = ({ onSendMessage }) => {
	const [text, setText] = useState('');

	// When input value is changed text state is updated with current value
	const onChange = (e) => {
		setText(e.target.value);
	};

	const onSubmit = (e) => {
		e.preventDefault(); //prevent a browser reload
		setText(''); // reset input field
		onSendMessage(text);
	};

	return (
		<div className="Input">
			<form onSubmit={onSubmit}>
				<input
					onChange={onChange}
					value={text}
					type="text"
					placeholder="<< ...speak now or forever hold your peace...>>"
					autoFocus={true}
				/>
				<button>
				<i className="ri-send-plane-2-line"></i>
				</button>
			</form>
		</div>
	);
};

export default Input;
