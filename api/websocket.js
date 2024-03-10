import dateUtils from '../utils/time'

// 图片\音频\视频 均为上传后的链接!

/**
 * 发送文本消息
 */
export function sendMsgText(ws, token, fid, user, msg, isGroup) {
  const data = {};
  data.code = 10002;
  data.token = token;
  const message = {};
  message.text = msg;
  message.createdAt = dateUtils.generateCurrentTime();
  const u = {};
  u._id = user.id;
  u.name = user.username;
  u.avatar = user.avatar;
  message.user = u;
  message.image = "";
  message.video = "";
  message.audio = "";
  message.system = false;
  message.receiveId = fid;
  message.isGroup = isGroup;
  data.msg = message;
  ws.send(JSON.stringify(data));
  console.log('发送消息...')
}

/**
 * 发送图片消息
 */
export function sendMsgImage(ws, token, fid, user, image, isGroup) {
  const data = {};
  data.code = 10002;
  data.token = token;
  const message = {};
  message.text = "";
  message.createdAt = dateUtils.generateCurrentTime();
  const u = {};
  u._id = user.id;
  u.name = user.username;
  u.avatar = user.avatar;
  message.user = u;
  message.image = image;
  message.video = "";
  message.audio = "";
  message.system = false;
  message.receiveId = fid;
  message.isGroup = isGroup;
  data.msg = message;
  ws.send(JSON.stringify(data));
}

/**
 * 发送文本+图片消息
 */
export function sendMsgTextAndImage(ws, token, fid, user, msg, url, isGroup) {
  const data = {};
  data.code = 10002;
  data.token = token;
  const message = {};
  message.text = msg;
  message.createdAt = dateUtils.generateCurrentTime();
  const u = {};
  u._id = user.id;
  u.name = user.username;
  u.avatar = user.avatar;
  message.user = u;
  message.image = url;
  message.video = "";
  message.audio = "";
  message.system = false;
  message.receiveId = fid;
  message.isGroup = isGroup;
  data.msg = message;
  ws.send(JSON.stringify(data));
}

/**
 * 发送音频消息
 */
export function sendMsgAudio(ws, token, fid, user, audio, isGroup) {
  const data = {};
  data.code = 10002;
  data.token = token;
  const message = {};
  message.text = "";
  message.createdAt = dateUtils.generateCurrentTime();
  const u = {};
  u._id = user.id;
  u.name = user.username;
  u.avatar = user.avatar;
  message.user = u;
  message.image = "";
  message.video = "";
  message.audio = audio;
  message.system = false;
  message.receiveId = fid;
  message.isGroup = isGroup;
  data.msg = message;
  ws.send(JSON.stringify(data));
  console.log("发送音频消息", data);
}

/**
 * 发送视频消息
 */
export function sendMsgVideo(ws, token, fid, user, video, isGroup) {
  const data = {};
  data.code = 10002;
  data.token = token;
  const message = {};
  message.text = "";
  message.createdAt = dateUtils.generateCurrentTime();
  const u = {};
  u._id = user.id;
  u.name = user.username;
  u.avatar = user.avatar;
  message.user = u;
  message.image = "";
  message.video = video;
  message.audio = "";
  message.system = false;
  message.receiveId = fid;
  message.isGroup = isGroup;
  data.msg = message;
  ws.send(JSON.stringify(data));
}
