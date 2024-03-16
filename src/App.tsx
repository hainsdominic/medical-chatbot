import { useEffect, useState } from "react";

function App() {
	const chatBox = document.querySelector("main");
	const chatInput = document.querySelector("input");
	const [waiting, setWaiting] = useState(false);

	const [messages, setMessages] = useState(
		[] as {
			side: string;
			text: string;
		}[]
	);

	useEffect(() => {
		appendMessage("bot", "Hello!");
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
			appendMessage("user", text);
			chatInput.value = "";
			setWaiting(true);
			setTimeout(() => {
				setWaiting(false);
				appendMessage("bot", "Whatup!");
			}, 3000);
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
						<div
							className={`msg -${message.side} bubble`}
							key={index}
						>
							{message.text}
						</div>
					))}
					{waiting && (
						<div className="msg -bot bubble">
							<div className="dots">•••</div>
						</div>
					)}
				</main>
				<form onSubmit={onSubmit}>
					<input type="text" placeholder="Message..." />
					<button type="submit">➤</button>
				</form>
			</section>
			<script type="text/javascript" src="index.js"></script>
		</>
	);
}

export default App;
