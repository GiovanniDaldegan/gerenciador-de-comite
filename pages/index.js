import { useState, useRef } from "react";
import Head from "next/head";
// import styles from "../styles/global.css";

let [speechTime, leaderSpeechTime] = [90, 120];
const comitees = ["CêFóf", "Tribunal Histórico", "Histórico", "ONU Mulheres", "Câmara", "Crise", "Senado", "ACNUR", "STF", "CDH", "OMS", "PNUMA"];

// TODO: dropdown para seleção do comitê, contagem de discursos, especificações do CêFóf (skip)

let list = [];
let onSpeech = false;
let speechCount, timeLeft = 0;

function Page() {
	const listRef = useRef(null);
	const intervalRef = useRef(null);

	let [tLState, setTLState] = useState(0);
	let [nameState, setNameState] = useState(null);


	// Speakers' List

	let [_list, setList] = useState(list);
	let [speaker, setSpeaker] = useState({ name: "", time: speechTime});

	const nameInput = useRef();
	const timeInput = useRef();


	function setDefaultSpeechTime(e) {
		if (e.target.value != 0) {
			speechTime = e.target.value;
		}
		else {
			speechTime = 90;
		}
	}

	function addSpeaker(skip=false) {
		const name = speaker.name;
		const time = speaker.time;

		if (name === "" || time < 0 || time === NaN ) {
			// TODO: 
			alert("Inscrição inválida.");
			return;
		}

		if (!skip) 	list.push(speaker);
		else 		list.splice(1, 0, speaker);

		setList(list);

		if (list.length == 1) {
			setNameState(list[0].name);
			timeLeft = list[0].time;
			setTLState(timeLeft);
		}

		nameInput.current.value = "";
		timeInput.current.value = speechTime;
		setSpeaker({ name: "" , time: speechTime });

		return;
	}

	function handleNameSubmition (e) {
		setSpeaker({ name: e.target.value, time: speaker.time });
	}

	function handleTimeSubmition (e) {
		e.target.value == 0
			? setSpeaker({ name: speaker.name, time: speechTime })
			: setSpeaker({ name: speaker.name, time: e.target.value });
	}


	// Speech player

	function startTimer() {
		if (!list[0] || onSpeech) return;

		onSpeech = true;

		intervalRef.current = setInterval(() => {
			// setList(list);
			timeLeft -= 0.01;
			setTLState(timeLeft);
		}, 10);
	}

	function resetTime() {
		if (!list[0]) return;

		clearInterval(intervalRef.current);
		onSpeech = false;

		timeLeft = list[0].time;
		setTLState(timeLeft);
	}

	function stopTimer(finish=false) {
		if (!list[0]) return;

		clearInterval(intervalRef.current);
		onSpeech = false;

		if (finish) {
			speechCount++;
			list.shift();
			setList(list);

			if (list[0]) {
				timeLeft = list[0].time;
				setNameState(list[0].name);
			}
			else {
				setNameState("");
				timeLeft = 0;
			}
		}
		setTLState(timeLeft);
	}

	if (onSpeech && tLState <= 0.02) {
		stopTimer(true);
	}


	return <div>
		<Head>
			<title>Lista de Oradores</title>
			<link rel="icon" href="../images/favicon.ico" />
		</Head>

		{/* <h1>{comitee}</h1> */}
		<h2>Lista de oradores</h2>

		<div>
			<p id="speaker" >Orador(a): {nameState}</p>
			<p id="time" >Tempo: {Math.floor(tLState)}</p>
		</div>

		<div id="speakersList">
			<ul id="list" >
				{_list.slice(1).map((s) => <li>{s.name} {s.time} </li>)}
			</ul>

			<input id="nameInput" onChange={handleNameSubmition} ref={nameInput} />
			<input  id="timeInput" type="number" defaultValue={speechTime} onChange={handleTimeSubmition} ref={timeInput} />

			<button onClick={() => addSpeaker()}>Adicionar</button>
			<button onClick={() => addSpeaker(true)} >Pular lista</button>
		</div>

		<div id="player" >
			<button onClick={startTimer} >Iniciar</button>
			<button onClick={() => stopTimer()} >Pausar</button>
			<button onClick={resetTime} >Restaurar tempo</button>
			<button onClick={() => stopTimer(true)} >Terminar discurso</button>

		</div>

		<>Tempo padrão de discurso: </><input id="defaultTime" type="number" onChange={setDefaultSpeechTime} />
	</div>;
}


export default Page;
