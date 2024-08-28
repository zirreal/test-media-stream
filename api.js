import {CREATE_CONF, CONF_OWNER} from './config';
import { OBSWebSocket } from 'obs-websocket-js';

const obs = new OBSWebSocket();
let id = '';


const connectingOBS = async (command) => {
  try {
    const {
      obsWebSocketVersion,
      negotiatedRpcVersion
    } = await obs.connect(process.env.OBS_WEBSOCKET, process.env.OBS_WS_PASS, {
      rpcVersion: 1
    });

    await obs.call(command);
    console.log(`Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion}) and executed ${command}`)

  } catch (error) {
    console.error('Failed to connect', error.code, error.message);
  } finally {
    await obs.disconnect();
  }
}

export const createConference = async (payload) => {
  try {
    const res = await fetch(CREATE_CONF, {
      method: 'POST',
      body: JSON.stringify(payload)
    })

    await connectingOBS('StartVirtualCam');

    const response = await res.json();
    id = response.conference.id;

  } catch(e) {
    console.log('error -> ', e)
  }
}


const activateConferenceLink = async () => {
  const url = `https://video.multi-agent.io/api/v3.9/software/clients?access_token=${process.env.CONF_TOKEN}&call_id=${id}&user=${CONF_OWNER}`;

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

    await connectingOBS('StopVirtualCam');

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