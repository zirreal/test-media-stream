import {CREATE_CONF} from './config';

let id = '';

export const createConference = async (payload) => {
  try {
    const res = await fetch(CREATE_CONF, {
      method: 'POST',
      body: JSON.stringify(payload)
    })

    const response = await res.json();
    id = response.conference.id;

  } catch(e) {
    console.log('error -> ', e)
  }
}


const activateConferenceLink = async () => {
  const url = `https://video.multi-agent.io/api/v3.9/software/clients?access_token=${process.env.CONF_TOKEN}&call_id=${id}&user=test1`;

  try {
    const res = await fetch(url)

    const response = await res.json();

    let webUrl = '';

    response.clients.map(el => {
      if(el.name === "TrueConf Web") {
        webUrl = el.web_url
      }
    })

    return webUrl;

  } catch(e) {
    console.log('error -> ', e)
  }

}


export const startConference = async () => {
  const iframe = document.querySelector('#iframe-trueconf');
  try {
    const res = await fetch(`https://video.multi-agent.io/api/v3.9/conferences/${id}/run?access_token=${process.env.CONF_TOKEN}`, {
      method: 'POST',
    })

    const response = await res.json();

    console.log(response, ' => conference has started');

    const webUrl = await activateConferenceLink()

    iframe.classList.remove('hide')
    iframe.src = webUrl;
    

  } catch(e) {
    console.log('error -> ', e)
  } finally {
  }
}


export const stopConference = async () => {

  const iframe = document.querySelector('#iframe-trueconf');
  try {
    const res = await fetch(`https://video.multi-agent.io/api/v3.9/conferences/${id}/stop?access_token=${process.env.CONF_TOKEN}`, {
      method: 'POST',
    })

    const response = await res.json();

    console.log(response, ' => conference has ended');

    await deleteConference()

    iframe.classList.add('hide')

  } catch(e) {
    console.log('error -> ', e)
  }

}


const deleteConference = async () => {
  try {
    const res = await fetch(`https://video.multi-agent.io/api/v3.9/conferences/${id}?access_token=${process.env.CONF_TOKEN}`, {
      method: 'DELETE',
    })

    const response = await res.json();

    console.log(response, ' => conference was deleted');

  } catch(e) {
    console.log('error -> ', e)
  }
}