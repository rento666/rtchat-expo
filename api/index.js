import { Platform } from "react-native";
import Toast from 'react-native-root-toast';
/**
 * api/index.js文件，封装了fetch方法
 * 在安卓模拟器中10.0.2.2代表着localhost
 * 在fetchWrapper中，需要res.json()
 * 在各自的Api中，body需要 JSON.stringify(form)
 */


const host1 = 'rtcode.asia';
const host2 = '101.42.11.155'
// const host = '10.131.127.177';
const port1 = '13799';
const port2 = '9988';


// const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080'
// const BASE_URL = Platform.OS === 'android' ? `http://${host1}:${port1}` : `http://localhost:${port1}`
const BASE_URL = `https://${host1}:${port1}`

export const pre_url = BASE_URL;

// export const ws_url = Platform.OS === 'android' ? `${host1}:${port2}` : `localhost:${port2}`
export const ws_url = `${host2}:${port2}`
// export const ws_url = Platform.OS === 'android' ? '10.0.2.2:9988' : 'localhost:9988'

const fetchWrapper = async (endpoint, options = {}) => {
  const url = `${BASE_URL}/${endpoint}`;
  console.log("当前请求API: " + url)
  // 超时时间是3秒，默认设置的是8秒
  options = {...options, timeout: 3000 }
  try {
    const res = await fetchWithTimeout(url, options);
    if(res.status === 404) {
      // 请求到了错误的方法
      console.log(url + " api接口不存在")
      return;
    }
    if (res.status != 200) {
      throw new Error(`HTTP 错误! 原因: ${JSON.stringify(res)}`);
    }
    const result = await res.json();
    
    return result;
  } catch (error) {
    console.log(endpoint + ' API 请求失败: ', error);
    if(error.name === 'AbortError'){
      Toast.show('请检查您的网络连接',{position: Toast.positions.CENTER,})
    }
    throw error;
  }
};

const fetchWithTimeout = async (resource, options = {}) => {
  const { timeout = 8000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
};

// 以下是导出的封装好的api

export const loginApi = (email,password) => {
  const endpoint = 'auth/login';
  const form = {};
  form.identifier = email;
  form.credential = password;
  return fetchWrapper(endpoint,{
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(form)
  });
};

export const registerApi = (email,password,code) => {
  const endpoint = 'auth/register';
  const form = {};
  form.identifier = email;
  form.credential = password;
  form.code = code;
  return fetchWrapper(endpoint,{
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(form)
  });
};

export const forgotPwd1Api = (email,password,code) => {
  const endpoint = 'auth/password';
  const form = {};
  form.identifier = email;
  form.credential = password;
  form.code = code;
  return fetchWrapper(endpoint,{
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(form)
  });
};

export const codeApi = (email,e_type,t) => {
  const endpoint = `auth/code?email=${email}&type=${e_type}&t=${t}`;
  return fetchWrapper(endpoint,{
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  });
};

export const userInfoApi = (token) => {
  const endpoint = 'user/info';
  return fetchWrapper(endpoint,{
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': token,
    },
  });
};

export const getUserByUidApi = (token,id) => {
  const endpoint = 'user/'+id;
  return fetchWrapper(endpoint,{
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': token,
    },
  });
};

export const searchApi = (token,query) => {
  const endpoint = 'search?keyword='+query;
  return fetchWrapper(endpoint,{
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': token,
    },
  });
};

export const uploadFileApi = (token,uri,mime) => {
  const endpoint = 'file/upload';

  let ftype = mime.split('/')[1];
  if(ftype === '3gpp'){
    ftype = '3gp';
  }
  let formData = new FormData();
  let file = { uri: uri, type: mime, name: "file." + ftype };
  formData.append('file', file);

  return fetchWrapper(endpoint, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      // 'Content-Type': 'multipart/form-data',
      'token': token,
    },
    body: formData,
  });
};

export const msgListApi = (token) => {
  const endpoint = 'msg/list';
  return fetchWrapper(endpoint,{
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': token,
    },
  });
};

export const getFriendMsgApi = (token, fid) => {
  const endpoint = 'msg/friend/'+ fid;
  return fetchWrapper(endpoint,{
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': token,
    },
  });
};

export const readFriendMsgApi = (token, fid) => {
  const endpoint = 'msg/read/friend/'+ fid;
  return fetchWrapper(endpoint,{
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': token,
    },
  });
};

export const readGroupMsgApi = (token, gid) => {
  const endpoint = 'msg/read/group/'+ gid;
  return fetchWrapper(endpoint,{
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': token,
    },
  });
};

export const getGroupMsgApi = (token, gid) => {
  const endpoint = 'msg/group/'+ gid;
  return fetchWrapper(endpoint,{
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': token,
    },
  });
};

export const addPostApi = (token,uid,img,texts) => {
  endpoint = 'post';
  const form = {};
  form.uid = uid;
  form.img = img;
  form.texts = texts;
  form.likes = 0;
  form.comments = 0;
  return fetchWrapper(endpoint,{
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': token,
    },
    body: JSON.stringify(form)
  });
}

export const getPostsApi = (token) => {
  const endpoint = 'post/self';
  return fetchWrapper(endpoint, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': token,
    },
  });
};

export const applyFriendApi = (token, fid, content, remark, label) => {
  endpoint = 'friend/apply';
  const form = {
    fid: fid,
    content: content,
    remark: remark,
    label: label,
  }
  return fetchWrapper(endpoint,{
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': token,
    },
    body: JSON.stringify(form)
  })
};

export const getFriendListApi = (token) => {
  return fetchWrapper('friend/list',{
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': token,
    },
  })
}

export const getNewFriendListApi = (token) => {
  return fetchWrapper('friend/list/apply',{
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': token,
    },
  })
}

export const agreeFriendApi = (token, fid) => {
  return fetchWrapper('friend/agree',{
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': token,
    },
    body: JSON.stringify(fid)
  })
}

export const refuseFriendApi = (token, fid) => {
  return fetchWrapper('friend/refuse',{
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': token,
    },
    body: JSON.stringify(fid)
  })
}

export const blockFriendApi = (token, fid) => {
  return fetchWrapper('friend/block',{
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': token,
    },
    body: JSON.stringify(fid)
  })
}

export const cancelBlockFriendApi = (token, fid) => {
  return fetchWrapper('friend/cancel',{
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': token,
    },
    body: JSON.stringify(fid)
  })
}

export const delFriendApi = (token, fid) => {
  return fetchWrapper('friend/del',{
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': token,
    },
    body: JSON.stringify(fid)
  })
}

export const getNewFriendCountApi = (token) => {
  return fetchWrapper('friend/new/count',{
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': token,
    },
  })
}

export const getGroupListApi = (token) => {
  return fetchWrapper('group/list',{
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': token,
    },
  })
}

export const updateUserApi = (token, word, type) => {
  if(!type && !word){
    console.log('参数错误')
    return;
  }
  // type 可选值有: username、about、phone、email
  let form = {}
  form[type] = word
  return fetchWrapper('user/update',{
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': token,
    },
    body: JSON.stringify(form)
  })
}

export const createGroupApi = (token, name, img) => {
  let form = {
    name: name,
    img: img
  }
  return fetchWrapper('group/new',{
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': token,
    },
    body: JSON.stringify(form)
  })
}

export const createGroupMembersApi = (token, gid, members) => {
  let form = {
    gid,
    members
  }
  return fetchWrapper('gm/new',{
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': token,
    },
    body: JSON.stringify(form)
  })
}

export const getNoReadCountApi = (token) => {
  return fetchWrapper('msg/noRead/count', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': token,
    },
  })
}

export const getGroupCountApi = (token,gid) => {
  return fetchWrapper('gm/count?gid='+gid, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': token,
    },
  })
}