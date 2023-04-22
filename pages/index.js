import { useState, useRef } from "react";
// import "./style.css";

const [speechTime, leaderSpeechTime] = [90, 120];
const comitees = ["CêFóf", "Tribunal Histórico", "Histórico", "ONU Mulheres", "Câmara", "Crise", "Senado", "ACNUR", "STF", "CDH", "OMS", "PNUMA"];

// TODO: dropdown para seleção dos comitês, timer, botão para início de discurso, alteração de tempo padrão de discurso

function Page() {

	const listRef = useRef();

	const comitee = comitees[Math.floor(Math.random() * comitees.length)];

	let secs = 0;
	const [time, setTime] = useState(null);
	const [now, setNow] = useState(null);

	const intervalRef = useRef(null);

	function startSpeech() {
		setTime(Date.now());
		setNow(Date.now());
		
		intervalRef.current = setInterval(() => setNow(Date.now), 10);

		// listRef.current.getElementById("list").getElementsByTagName("li")[0].active = true;
	}

	function resetTime() {

	}

	function finishSpeech() {

	}

	function updateTimer(timer) {
		setSeconds(Math.floor((finishTime - Date.now) / 1000));
	}


	return <div>
			<h1>{comitee}</h1>

			<div>
				<SpeakersList ref={listRef} />

				<button onClick={startSpeech} >Iniciar</button>

			{/*
			<div id="player">
				<button className="button" >Iniciar discurso</button>
				<button className="button" ></button>
			</div>
			*/}
			</div>
	</div>;
}


function SpeakersList() {
	let [list, setList] = useState([]);
	let [speaker, setSpeaker] = useState({ name: "", time: speechTime });

	const nameInput = useRef();
	const timeInput = useRef();


	function addSpeaker () {
		const name = speaker.name;
		const time = speaker.time;

		if (name === "" || time < 0 || time === NaN ) {
			alert("Inscrição inválida.");
			return;
		}
		else if (time > leaderSpeechTime) {
			alert("Tempo de discurso mais extenso que o permitido.");
			return;
		}

		let tempArr = list;
		tempArr.push(speaker);

		setList(tempArr);

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

	return <div>
		<h2>Lista de oradores</h2>

			<div id="speakersList">
				<ul id="list">
					{list.map((s) => <li>{s.name} <Timer value={s.time} /> </li>)} {/*check if s.time === 0*/}
				</ul>
			</div>

		<input id="nameInput" onChange={handleNameSubmition} ref={nameInput} />
		<input id="timeInput" type="number" defaultValue={speechTime} onChange={handleTimeSubmition} ref={timeInput} />

		<button onClick={addSpeaker}>Adicionar</button>
	</div>
}

function Timer({ value }) {
	let [seconds, setSeconds] = useState(value);
	let active = true;

	let finishTime;

	function setTimer() {
		finishTime = new Date().getTime() + seconds * 1000;
	}

	// TODO: transfer timer styling to style.css
	return <div className="timer" style={{display: "inline-block"} } onClick={setTimer} >{value}</div>;
}

export default Page;
