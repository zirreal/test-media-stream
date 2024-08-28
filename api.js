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


export const startConference = async () => {
  const iframe = document.querySelector('#iframe-trueconf');
  try {
    const res = await fetch(`https://video.multi-agent.io/api/v3.9/conferences/${id}/run?access_token=${process.env.CONF_TOKEN}`, {
      method: 'POST',
    })

    const response = await res.json();

    console.log(response, ' => conference has started');


    iframe.classList.remove('hide')
    iframe.src = `https://video.multi-agent.io/webrtc/${id}#login=*guest2*webguest*guest2&token=$2dcee89b80bf8682c45f04d59b2dba27a*1724330878*cd31e9570451edc00d7608e2b9017cb7&lang=auto`;


  } catch(e) {
    console.log('error -> ', e)
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