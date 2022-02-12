let loading = false
const messagesBox = document.querySelector('dl')
const contactsElement = document.querySelector('.list-of-contacts')
let message = '';
let contact = {}

function checkUser(){
  if(!localStorage.getItem('user')) {
    window.location.pathname = "/home.html"
  }
}

async function postRequest(router, data) {
  const request = await fetch(`https://mock-api.driven.com.br/api/v4/uol/${router}`, {
    method:'post',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  return request;
}

async function getRequest(router) {
  const request = await fetch(`https://mock-api.driven.com.br/api/v4/uol/${router}`)
  return await request.json()
}

async function sendForm(event) {
  event.preventDefault()
  enableLoading(true)
  const name = document.querySelector('input').value
  const { status } = await postRequest('participants', {name})
  if(status === 200) {
    enableLoading(false)
    localStorage.setItem('user', name)
    window.location.href= "/"
  } else {
    enableLoading(false)
    showMessage()
  }
}

function enableLoading(loading) {
  const loadingElement = document.querySelector('.load-area')
  const formElement = document.querySelector('form')
  if(loading) {
    formElement.style.display = "none"
    loadingElement.classList.remove('not-loading')
  } else {
    formElement.style.display = "flex"
    loadingElement.classList.add('not-loading')
  }
}

function showMessage() {
  const message = document.querySelector('.message-warning');
  message.style.display = "block"
}

function templateEnterTheRoom(item) {
  return `
  <dt class="dt message-login d-flex align-items-center">
    <span>
      <strong class="strong">${item.from}</strong>
    </span>
    <img src="app/_img/login.svg" width="20" class="icon-login" />
    <span>Entrou</span>
    <span class="date-message"><time datetime="${item.time}">${item.time}</time></span>
  </dt>
  `
}

function templateMessageToEveryone(item) {
  return `
    <dt class="dt message-public">
    <span><strong class="strong">${item.from}</strong> para <strong class="strong">${item.to}:</strong> </span>
    ${item.text}
    <span class="date-message"><time datetime="${item.time}">${item.time}</time></span>
    </dt>
  `
}

function templatePrivateMessage(item) {
  return `
    <dt class="dt message-private">
      <span>
        <strong class="strong">${item.from}</strong> 
        reservadamente para 
        <strong class="strong">${item.to}:</strong>
      </span>
      <span>${item?.text}</span>
      <span class="date-message"><time datetime="${item?.time}">${item.time}</time></span>
    </dt>
  `
}

function templateOwnMessages(item) {
  return `
    <dd class="dd message-me me align-self-end">
      <span><strong class="strong">${item.from} ${contact.visibility === 'reservadamente' ? 'reservadamente' : ''}</strong> para <strong
          class="strong">${item.to}:</strong></span>&nbsp;
      <span>${item.text}</span>
      <span class="date-message"><time datetime="${item.time}">${item.time}</time></span>
    </dd>
  `
}

function templateContacts(name) {
  return `
    <li class="d-flex align-items-center" onclick="clickedPerson(this)" data-user="${name}">
      <img src="app/_img/profile.svg" alt="profile" />
      <span class="font-family-roboto">${name}</span>
      <img src="app/_img/check.svg" alt="profile" class="logo-check" />
    </li>
  `
}

async function fetchMessage() {
  const messages = await getRequest('messages')
  renderMessages(messages)
}

function renderMessages(messages) {
  messagesBox.innerHTML = "";
  messages.forEach( item => {
    if(item.type === 'status') {
      messagesBox.innerHTML += templateEnterTheRoom(item)
    } 
    else if (item.type === 'message' && item.to === 'Todos' && item.from !== localStorage.getItem('user')) {
      messagesBox.innerHTML += templateMessageToEveryone(item)
    } else if (item.type === 'message' && item.to === localStorage.getItem('user') ) {
      messagesBox.innerHTML += templatePrivateMessage(item)
    } else if(item.type === 'message' && item.from === localStorage.getItem('user')) {
      messagesBox.innerHTML += templateOwnMessages(item)
    }
  } )
  document.querySelector('.dt:last-child').scrollIntoView()
}

function renderContacts(contacts) {
  contactsElement.innerHTML = ""
  contacts.forEach( item => {
    contactsElement.innerHTML += templateContacts(item.name)
  } )
}


async function myMessage(event) {

  let message = document.querySelector('textarea');
  if(message.value !== '' && event.key === 'Enter') {
    await sendMessage({ 
      from: localStorage.getItem('user'),
      to: contact.name || 'Todos',
      text: message.value,
      type: 'message'
     })
    message.value = ""
  }
}

async function sendMessage(data) {
  const response = await postRequest('messages', data)
  if(response.status !== 200) {
    localStorage.clear('user')
    window.location.href="home.html"
  }
}

async function keepConnected() {
  await postRequest('status', {
    name: localStorage.getItem('user')
  })
}

function enableOptions() {
  let modal = document.querySelector('.modal');
  let messageOptions = document.querySelector('.message-options')
  modal.classList.toggle('visible')
  messageOptions.classList.toggle('visible')
}

async function searchParticipants() {
  const participants = await getRequest('participants')
  renderContacts(participants)
}

function clickedPerson(elemento) {
  const listContacts = contactsElement.querySelectorAll('li')
  listContacts.forEach( item => item.classList.remove('check') )
  elemento.classList.add('check')
  contact.name = elemento.dataset.user;
}

function visibilityMessage(visibility) {
  const elementClicked = document.querySelectorAll('.message-header')
  elementClicked.forEach( item => item.classList.remove('check') )
  contact.visibility = visibility.dataset.visibility;
  visibility.classList.add('check')
}

setInterval(keepConnected, 5000)
setInterval(fetchMessage, 3000)
setInterval(searchParticipants, 10000)