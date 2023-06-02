import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import Messages from './Messages';
import { randomColor, randomName } from './Random';
import Input from './Input';
import 'remixicon/fonts/remixicon.css'


const App = () => {
	const [messages, setMessages] = useState([]);
	const [member, setMember] = useState({
		username: randomName(),
		color: randomColor(),
	});

	// Warning - need to use the useMemo hook
	const drone = useMemo(() => {
		return new window.Scaledrone('23axSpJJy7sehPRM', {
			data: member,
		});
	}, []);

	useEffect(() => {
		// When drone connection is open > event listeners
		drone.on('open', (error) => {
			if (error) {
				return console.error(error);
			}
			const updatedMember = { ...member };
			updatedMember.id = drone.clientId;
			setMember(updatedMember);
		});

		const room = drone.subscribe('observable-room');

		// Listening... when something comes > update msg state
		room.on('data', (data, member) => {
			setMessages((prevMessages) => [
				...prevMessages,
				{
					text: data,
					member: member,
					timestamp: Date.now(),
				},
			]);
		});
	}, [drone, member]);

	const onSendMessage = (message) => {
		// Publish message to room
		if (message.trim() !== '') {
			drone.publish({
				room: 'observable-room',
				message,
			});
		}
	};

	return (
		<div className="App">
			<header className="App-header">C H A T A O N I C A 🙈 🙉 🙊</header>
			<Messages messages={messages} currentMember={member} />
			<Input onSendMessage={onSendMessage} />
		</div>
	);
};

export default App;
