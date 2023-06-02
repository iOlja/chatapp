import React, { useEffect, useRef } from 'react';
import './App.css';

const Messages = ({ messages, currentMember }) => {
  // Create a ref using useRef to reference the messages list element
  const messagesRef = useRef(null);

  // Scroll to the bottom when we have new msg
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  // Render a single message
  const renderMessage = (message, index) => {
    const { member, text, timestamp } = message;

    // Check is the msg from current member or other
    const messageFromMe =
      member &&
      member.clientData &&
      member.clientData.username === currentMember.username;

    const className = messageFromMe
      ? 'Messages-message currentMember'
      : 'Messages-message';

    // Style the avatar random color
    const avatarStyle = {
      backgroundColor: member.clientData.color,
    };

    // Username random name
    const username = member.clientData.username;

    // Timestamp
    const formattedTimestamp = formatTimestamp(timestamp);

    return (
      <li key={index} className={className}>
        <span className="avatar" style={avatarStyle} />
        <div className="Message-content">
          <div className="username">{username}</div>
          <div className="text">{text}</div>
          <div className="timestamp">{formattedTimestamp}</div>
        </div>
      </li>
    );
  };

  return (
    <ul ref={messagesRef} className="Messages-list">
      {messages.map(renderMessage)}
    </ul>
  );
};

// Format for timestamp hour:minute
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const options = {
    hour: 'numeric',
    minute: 'numeric',
  };
  const formattedTime = date.toLocaleTimeString([], options);
  return `${formattedTime}`;
};

export default Messages;
