function checkUser(){
  if(!localStorage.getItem('user')) {
    window.location.pathname = "/home.html"
  }
}

async function postRequest(router, data) {
  const registerName = await fetch(`https://mock-api.driven.com.br/api/v4/uol/${router}`, {
    method:'post',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({name: data})
  })
  return registerName;
}

async function sendForm(event) {
  event.preventDefault()
  const name = document.querySelector('input').value
  const { status } = await postRequest('participants', name)
  if(status === 200) {
   localStorage.setItem('user', 'user')
   window.location.href= "/"
  }
}