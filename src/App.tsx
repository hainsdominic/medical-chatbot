import { useEffect, useState } from 'react';
import prompts from './prompts.json';

async function generateMessage(data: {
  inputs: string;
}): Promise<{ generated_text: string }> {
  console.log('start');
  const response = await fetch(
    'https://xevhza5rhd1jhkq8.us-east-1.aws.endpoints.huggingface.cloud',
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        inputs: data.inputs,
      }),
    }
  );
  console.log('end');
  const result = await response.json();
  return result[0];
}

interface historyMessage {
  actor: string;
  message: string;
}

function App() {
  const chatBox = document.querySelector('main');
  const chatInput = document.querySelector('input');
  const [waiting, setWaiting] = useState(false);
  const [history, setHistory] = useState(prompts as historyMessage[]);

  const [messages, setMessages] = useState(
    [] as {
      side: string;
      text: string;
    }[]
  );

  useEffect(() => {
    appendMessage('bot', prompts[0].message);
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

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = chatInput?.value;
    if (text) {
      appendMessage('user', text);
      chatInput.value = '';
      setWaiting(true);
      let message: { generated_text: string };
      do {
        const systemPrompt =
          "\n\nYou are a professional medical assistant, this is what you should respond:'.";

        const conversation = history
          .map((message) => {
            return `${message.message}`;
          })
          .join('\n');

        const newConversation = conversation + `\nuser: ${text}`;

        const prompt = newConversation + systemPrompt;
        console.log(prompt);
        message = await generateMessage({
          inputs: prompt,
        });
        console.log(JSON.stringify(message, null, 2));
      } while (message.generated_text === '');
      setWaiting(false);
      appendMessage('bot', message.generated_text);
      setHistory((prevHistory) => [
        ...prevHistory,
        {
          actor: 'user',
          message: text,
        },
        {
          actor: 'bot',
          message: message.generated_text,
        },
      ]);
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
            <div className={`msg -${message.side} bubble`} key={index}>
              {message.text}
            </div>
          ))}
          {waiting && (
            <div className='msg -bot bubble'>
              <div className='dots'>•••</div>
            </div>
          )}
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
