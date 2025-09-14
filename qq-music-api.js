// QQ 音乐 API 合集
// 作者：Copcin
// 2025.9 更新
// 所有 API 2025.9 确认可用

// 所有 API 均有 origin 选项方便调试，默认为 false
// 若 origin 为 true 则直接返回请求返回的 data

// 获取音乐 URL（2025.9 重新抓包）
// API：https://u.y.qq.com/cgi-bin/musicu.fcg
//
// songmid: 歌曲 MID（字符串）
// quality: 歌曲品质（字符串），有 m4a、128、320（默认）可选，其中 128、320 为 MP3 格式，默认为 320

export let getMusicURL = async (songmid, quality = "320", origin = false) => {
  return await fetch("https://u.y.qq.com/cgi-bin/musicu.fcg", {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      "content-type": "application/json;charset=UTF-8",
      priority: "u=1, i",
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "none",
      "sec-fetch-storage-access": "active",
    },
    referrer: "https://y.qq.com/",
    body: '{"req_1":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey","param":{"filename":["PREFIXSONGMIDSONGMID.SUFFIX"],"guid":"10000","songmid":["SONGMID"],"songtype":[0],"uin":"0","loginflag":1,"platform":"20"}},"loginUin":"0","comm":{"uin":"0","format":"json","ct":24,"cv":0}}'
      .replaceAll("SONGMID", songmid)
      .replaceAll(
        "PREFIX",
        quality.toLowerCase() == "m4a"
          ? "C400"
          : quality == "128"
          ? "M500"
          : "M800"
      )
      .replaceAll("SUFFIX", quality.toLowerCase() == "m4a" ? "m4a" : "mp3"),
    method: "POST",
    mode: "cors",
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      if (origin) return data;
      else return data.req_1.data.sip[0] + data.req_1.data.midurlinfo[0].purl;
    })
    .catch((err) => {
      console.log(err);
    });
};

// 获取歌单歌曲信息
// API：https://i.y.qq.com/qzone-music/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg
//
// categoryID：歌单 ID
export let getSongList = async (categoryID, origin = false) => {
  return await fetch(
    "https://i.y.qq.com/qzone-music/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg?type=1&json=1&utf8=1&onlysong=0&nosign=1&disstid=CATEGORYID&g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=GB2312&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0".replaceAll(
      "CATEGORYID",
      categoryID
    )
  )
    .then((res) => res.json())
    .then((data) => {
      if (origin) return data;
      else return data.cdlist[0].songlist;
    })
    .catch((err) => {
      console.log(err);
    });
};

// 获取歌单名称
// API：https://i.y.qq.com/qzone-music/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg
//
// categoryID：歌单 ID
export let getSongListName = async (categoryID, origin = false) => {
  return await getSongList(categoryID, true).then((data) => {
    if (origin) return data;
    else return data.cdlist[0].dissname;
  });
};

// 用关键词搜索歌曲
// API: https://u.y.qq.com/cgi-bin/musicu.fcg
//
// keyword: 关键词（字符串）
// searchType: 搜索结果类型（默认为 0），0 为歌曲，2 为专辑，3 为歌单，4 为 MV，7 为歌词，8 为用户
// resultNum: （每页）结果数量（默认为 50）
// pageNum: 页面序号（不是页数，默认为 1）
export let searchWithKeyword = async (
  keyword,
  searchType = 0,
  resultNum = 50,
  pageNum = 1,
  origin = false
) => {
  return await fetch("https://u.y.qq.com/cgi-bin/musicu.fcg", {
    credentials: "include",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
      Accept: "application/json, text/plain, */*",
      "Accept-Language":
        "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
      "Content-Type": "application/json;charset=utf-8",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
    },
    body: '{"comm":{"ct":"19","cv":"1859","uin":"0"},"req":{"method":"DoSearchForQQMusicDesktop","module":"music.search.SearchCgiService","param":{"grp":1,"num_per_page":RESULTNUM,"page_num":PAGENUM,"query":"KEYWORD","search_type":SEARCHTYPE}}}'
      .replaceAll("KEYWORD", keyword)
      .replaceAll("RESULTNUM", resultNum)
      .replaceAll("PAGENUM", pageNum)
      .replaceAll("SEARCHTYPE", searchType),
    method: "POST",
    mode: "cors",
  })
    .then((res) => res.json())
    .then((data) => {
      if (origin) return data;
      else {
        switch (searchType) {
          case 0:
          case 7:
            return data.req.data.body.song;
          case 2:
            return data.req.data.body.album;
          case 3:
            return data.req.data.body.songlist;
          case 4:
            return data.req.data.body.mv;
          case 8:
            return data.req.data.body.user;
          default:
            return data.req.data.body;
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

// 获取歌曲歌词
// API: https://i.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg
//
// songmid: 歌曲 MID（字符串）
// parse: 是否需要解析歌词（默认为 false)，若为 true 则调用 parseLyric 函数对请求到的歌词字符串进行解析。
// 解析效果见 parseLyric 的注释。
export let getSongLyric = async (songmid, parse = false, origin = false) => {
  return await fetch(
    "https://i.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?songmid=SONGMID&g_tk=5381&format=json&inCharset=utf8&outCharset=utf-8&nobase64=1".replaceAll(
      "SONGMID",
      songmid
    )
  )
    .then((res) => res.json())
    .then((data) => {
      if (origin) return data;
      else {
        if (!parse) {
          return data.lyric + "\n" + data.trans;
        } else return parseLyric(data);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

// 获取专辑歌曲信息
// API: https://i.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg
//
// albummid: 专辑的 MID
export let getAlbumSongList = async (albummid, origin = false) => {
  return await fetch(
    "https://i.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg?platform=h5page&albummid=ALBUMMID&g_tk=938407465&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&_=1459961045571".replaceAll(
      "ALBUMMID",
      albummid
    )
  )
    .then((res) => res.json())
    .then((data) => {
      if (origin) return data;
      else return data.data.list;
    })
    .catch((err) => {
      console.log(err);
    });
};

// 获取专辑名称
// API: https://i.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg
//
// albummid: 专辑的 MID
export let getAlbumName = async (albummid, origin = false) => {
  return await getAlbumSongList(albummid, true).then((data) => {
    if (origin) return data;
    else return data.data.name;
  });
};

// 获取 MV 信息
// API: https://u.y.qq.com/cgi-bin/musicu.fcg
//
// vid: MV 的 VID
// 本 API 返回的 Data 已是最简的 JSON，所以无论 origin 是否为 true 都直接返回 data。
export let getMVInfo = async (vid, origin = true) => {
  return await fetch("https://u.y.qq.com/cgi-bin/musicu.fcg", {
    credentials: "include",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
      Accept: "*/*",
      "Accept-Language":
        "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
      "Content-type": "application/x-www-form-urlencoded",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-site",
    },
    referrer: "https://y.qq.com/",
    body: '{"comm":{"ct":6,"cv":0,"g_tk":1646675364,"uin":0,"format":"json","platform":"yqq"},"mvInfo":{"module":"music.video.VideoData","method":"get_video_info_batch","param":{"vidlist":["VID"],"required":["vid","type","sid","cover_pic","duration","singers","new_switch_str","video_pay","hint","code","msg","name","desc","playcnt","pubdate","isfav","fileid","filesize_v2","switch_pay_type","pay","pay_info","uploader_headurl","uploader_nick","uploader_uin","uploader_encuin","play_forbid_reason"]}},"mvUrl":{"module":"music.stream.MvUrlProxy","method":"GetMvUrls","param":{"vids":["VID"],"request_type":10003,"addrtype":3,"format":264,"maxFiletype":60}}}'.replaceAll(
      "VID",
      vid
    ),
    method: "POST",
    mode: "cors",
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => {
      console.log(err);
    });
};

// 获取歌手信息
// API: https://u.y.qq.com/cgi-bin/musicu.fcg
//
// singermid: 歌手 MID
export let getSingerInfo = async (singermid, origin = false) => {
  return await fetch(
    "https://u.y.qq.com/cgi-bin/musicu.fcg?format=json&loginUin=0&hostUin=0inCharset=utf8&outCharset=utf-8&platform=yqq.json&needNewCode=0&data=%7B%22comm%22%3A%7B%22ct%22%3A24%2C%22cv%22%3A0%7D%2C%22singer%22%3A%7B%22method%22%3A%22get_singer_detail_info%22%2C%22param%22%3A%7B%22sort%22%3A5%2C%22singermid%22%3A%22SINGERMID%22%2C%22sin%22%3A0%2C%22num%22%3A50%7D%2C%22module%22%3A%22music.web_singer_info_svr%22%7D%7D".replaceAll(
      "SINGERMID",
      singermid
    )
  )
    .then((res) => res.json())
    .then((data) => (origin ? data : data.singer.data))
    .catch((err) => {
      console.log(err);
    });
};

// 附赠小工具

// 获取专辑封面图
//
// albummid: 专辑的 MID
export let getAlbumCoverImage = (albummid) => {
  return "https://y.gtimg.cn/music/photo_new/T002R300x300M000ALBUMMID.jpg".replaceAll(
    "ALBUMMID",
    albummid
  );
};

// 解析歌词
//
// data：从 QQ 音乐申请来的数据
//
// 解析格式：对象。ti、ar、al、by、offset 的有无取决于 QQ 音乐
// ti: (title) 标题
// ar：(artist) 创作者
// al: (album) 专辑
// by: 没看过有内容的
// offset: 偏移量，没看过不为 0 的，应该是针对歌词时间而言的。
// count：歌词数量，为整型
// haveTrans: 是否有翻译，为布尔值
// lyric：列表。列表内容为对象，每个对象由 time、lyric 和 trans 三个键构成。
// time 为时间，lyric 为歌词，trans 为翻译。
export let parseLyric = (data) => {
  let parsed = {
    ti: "",
    ar: "",
    al: "",
    by: "",
    offset: "",
    count: 0,
    haveTrans: false,
    lyric: [],
  };
  let lyric = data.lyric.split("\n");
  let trans = data.trans.split("\n");
  parsed.haveTrans = !(trans == "");

  let substr = (str) => str.substring(str.indexOf(":") + 1, str.indexOf("]"));
  if (!lyric[0].startsWith("[0")) {
    parsed.ti = substr(lyric[0]);
    parsed.ar = substr(lyric[1]);
    parsed.al = substr(lyric[2]);
    parsed.by = substr(lyric[3]);
    parsed.offset = substr(lyric[4]);
    lyric = lyric.slice(5);
    if (parsed.haveTrans) trans = trans.slice(5);
  }

  parsed.count = lyric.length;
  for (let i = 0; i < parsed.count; i++) {
    let ele = { time: "", lyric: "", trans: "" };
    ele.time = lyric[i].substring(1, lyric[i].indexOf("]"));
    ele.lyric = lyric[i].substring(lyric[i].indexOf("]") + 1);
    if (parsed.haveTrans)
      ele.trans = trans[i].substring(trans[i].indexOf("]") + 1);
    parsed.lyric.push(ele);
  }

  return parsed;
};
