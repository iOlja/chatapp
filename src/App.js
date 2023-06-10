import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import Messages from './Messages';
import { randomColor, randomName } from './Random';
import Input from './Input';
import 'remixicon/fonts/remixicon.css';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [member, setMember] = useState({
    username: randomName(),
    color: randomColor(),
  });

  const [onlineUsers, setOnlineUsers] = useState([]);

  // Create a drone instance using useMemo to prevent unnecessary re-creation
  const drone = useMemo(() => {
    return new window.Scaledrone('e0Z65USWjxthBt0E', {
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

    // Who's online
    room.on('open', (error) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log('Connected to room');
    });

    // Update the list of online users when members join
    room.on('members', (members) => {
      setOnlineUsers(members);
    });

    // Add a new member to the online users list when someone joins
    room.on('member_join', (member) => {
      setOnlineUsers((prevUsers) => {
        // Check if the member is already in the list
        if (prevUsers.some((user) => user.id === member.id)) {
          return prevUsers; // If already in the list, return the previous state
        }
        return [...prevUsers, member]; // If not in the list, add the member
      });
    });

    // Remove a member from the online users list when someone leaves
    room.on('member_leave', ({ id }) => {
      setOnlineUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    });

    // Listening... when a new message comes in, update the messages state
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
    // Publish message to the room
    if (message.trim() !== '') {
      drone.publish({
        room: 'observable-room',
        message,
      });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
			Hello {member.username}!
          <div className="Welcome">
           
						<br/>
						Currently online and available for a chat are these cool people:
          </div>
          <div className="Online-users">
            {/* Display the usernames of online users */}
            {onlineUsers.map((user) => user.clientData.username).join(', ')}
          </div>
      </header>
      <Messages messages={messages} currentMember={member} />
      <Input onSendMessage={onSendMessage} />
    </div>
  );
};

export default App;
