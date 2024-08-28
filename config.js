export const
 WS_API_URL = 'http://127.0.0.1:1984/', // websocket url
 SOURCE_URL = '?src=anime&media=video+audio', // url for source video (anime girl)
 CAM_URL = '?src=webcam&media=camera+microphone', // url for webcam stream
 GO2RTC_API = 'http://localhost:8001/go2rtc', // go2rtc api 
 CREATE_CONF = `https://video.multi-agent.io/api/v3.9/conferences?access_token=${process.env.CONF_TOKEN}`,
 CONF_OWNER = 'test2', // trueconf username
 CONF_OBJECT = {
  topic: 'DEMO CONF',
  type: 0,
  auto_invitation: 0,
  max_participants: 5,
  invitations: [{id: CONF_OWNER}],
  schedule: {"type":-1},
  owner: CONF_OWNER,
  allow_guests: true,
 } // trueconf conference object to start conf
;




