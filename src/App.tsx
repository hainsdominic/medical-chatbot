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
  const [history, setHistory] = useState([] as historyMessage[]);

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
      setHistory((prevHistory) => [
        ...prevHistory,
        {
          actor: 'user',
          message: text,
        },
      ]);
      setWaiting(true);
      let message;
      do {
        const systemPrompt =
          'You are a professional medical assistant, here is a conversation between you and a patient. Respond to the patient in a professional manner.\n\n';

        const conversation = history
          .map((message) => {
            return `${message.actor}: ${message.message}`;
          })
          .join('\n');

        message = await generateMessage({
          inputs: systemPrompt + conversation,
        });
        console.log(JSON.stringify(message, null, 2));
      } while (message.generated_text === '');
      setWaiting(false);
      appendMessage('bot', message.generated_text);
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
