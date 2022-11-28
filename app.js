const btnStart = document.querySelector('.btn-start')
const screens = document.querySelectorAll('.screen')
const btnTimes = document.querySelectorAll('.time-btn')
const time = document.querySelector('.time')
const board = document.querySelector('.board')
const colors = ['red', 'yellow', 'black', 'orange', 'blue', 'green', 'grey', 'silver', 'gold', 'violet', 'pink', 'white']

let timeX = 0
let score = 0
let interval = ""
let users = []


btnStart.addEventListener('click', (event) => {
	event.preventDefault()
	
	screens[0].classList.add('screen-up')
})

btnTimes.forEach((item) => {
	item.addEventListener('click', (event) => {
		event.preventDefault()

		timeX = parseInt(event.target.innerText)
		screens[1].classList.add('screen-up')
		startGame()	
	})
})

board.addEventListener('click', (event) => {
	if(event.target.classList.contains('circle')) {
		score++
		event.target.remove()
		if(event.target.style.background === "green") {
			createRandomCircle(2)
			event.target.remove()
		}createRandomCircle(1)
	}
	if(event.target.style.background === "red") {
		--score
	}
})




function startGame() {
	interval = setInterval(decreaseTime, 1000)
	createRandomCircle(2)
	setTime(timeX)
	return interval
}





function decreaseTime() {
	if(timeX === 0) {
		clearInterval(interval)
		finishGame()
	}else {
		let currentTime = --timeX
	if(currentTime < 10) {
		currentTime = `0${currentTime}`
	}setTime(currentTime)
	}
}




function setTime(value) {
	time.innerHTML = `00:${value}`
}




function createRandomCircle(num) {
	for(let i = 0; i < num; i++) {
		const circle = document.createElement('div')
	circle.classList.add('circle')
	const {width, height} = board.getBoundingClientRect()
	const size = getRandomNumber(1, 60)

	circle.style.width = `${size}px`
	circle.style.height = `${size}px`
	circle.style.top = `${getRandomNumber(0, height - size)}px`
	circle.style.left = `${getRandomNumber(0, width - size)}px`
	circle.style.background = `${colors[getRandomColors()]}`

	board.append(circle)
	}
}




function getRandomNumber(min, max) {
	return Math.round(Math.random() * (max - min) + min)
}




function getRandomColors() {
	return Math.floor(Math.random() * colors.length)
}





function finishGame() {
	time.parentNode.classList.add('hide')
	board.innerHTML = `<h1>Счет: <span class="primary">${score}</span></h1>`

	document.addEventListener('keyup', (event)=> {
		event.preventDefault()
		
		if(event.code === 'Enter') {
		board.innerHTML = "<h1>Ваше Имя?</h1><input class='input-area' type = 'text'> <button class='input-btn'>жми</button>"
		}
		if(event.target.classList.contains('input-area')){
			document.querySelector('.input-btn').addEventListener('click', setUserName)
		} 
	})
}





/*Функция обработчик событий, которая выполняется после нажатия на кнопку ввода Имени в поле input */
function setUserName(e) {
		e.preventDefault()
		
		let a = document.querySelector('.input-area')

		let user = {
			name: a.value,
			score: score
		}

		if(JSON.parse(localStorage.getItem('muKey'))) {
			let get = JSON.parse(localStorage.getItem('muKey'))
			get.push(user)
			saveUsers(get)
			
		} else {
			users.push(user)
			saveUsers(users)
		}	

		a.value = ""
		board.remove()
		screens[2].innerHTML = "<button class='repeat-btn'>Повторить</button>"

		let repeat = document.querySelector('.repeat-btn')
		repeat.addEventListener('click', () => {
				screens.forEach((item)=> {
					item.classList.remove('screen-up')
				})
			screens[0].classList.add('screen-up')
		})

		getUsersInLeaderBoard()
		hide('.leader-board')
}






function saveUsers(arr) {
		let localStorageBoard = JSON.stringify(arr)
		localStorage.setItem('myKey', localStorageBoard)
}




function getUsersInLeaderBoard() {
	JSON.parse(localStorage.getItem('myKey')).sort((a, b)=> b.score - a.score).forEach((obj)=> {
		const {name, score} = obj
		const leaderBoard = document.createElement('div')
		leaderBoard.classList.add('leader-board')
		leaderBoard.innerHTML = `${name}: ${score}`
		screens[2].append(leaderBoard)
	})
}




function hide(className) {
	let a = document.querySelector(className)
	a.classList.add('hide')
}