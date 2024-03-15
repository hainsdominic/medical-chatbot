import { useEffect, useState } from 'react';

function App() {
  const chatBox = document.querySelector('main');
  const chatInput = document.querySelector('input');
  const [messages, setMessages] = useState(
    [] as {
      side: string;
      text: string;
    }[]
  );

  useEffect(() => {
    appendMessage('left', 'Hello!');
  }, []);

  function appendMessage(side: string, text: string) {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        side,
        text,
      },
    ]);
    chatBox?.scrollTo(0, chatBox.scrollHeight);
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = chatInput?.value;
    if (text) {
      appendMessage('right', text);
      chatInput.value = '';
      setTimeout(() => {
        appendMessage('left', 'Hello!');
      }, 1000);
    }
  }

  return (
    <>
      <section>
        <header>
          <h1>Chatbox</h1>
        </header>
        <main>
          {messages.map((message, index) => (
            <div className={`msg -${message.side}`} key={index}>
              {message.text}
            </div>
          ))}
        </main>
        <form onSubmit={onSubmit}>
          <input type='text' placeholder='Message...' />
          <button type='submit'></button>
        </form>
      </section>
      <script type='text/javascript' src='index.js'></script>
    </>
  );
}

export default App;
