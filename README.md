# QQ-music-api

在 QQ 音乐客户端下载音乐的时候遇到了“仅 VIP 有效期内可听”，然后就抓了个包并把文件下载了下来。后面发现这样的 API 挺多的，就把它们用 fetch 重新实现了一下（很简陋……）

说来很奇葩，我在写这些 API 的时候全程用的 Listen 1 网页的控制台测试。所以如果真的要用建议代理。

## 文档

所有 API 均为异步函数，且均有 origin 方便调试，默认为 false。若 origin 为 true 则直接返回请求返回的 data。

### 获取歌曲 URL

**原 API：**https://u.y.qq.com/cgi-bin/musicu.fcg

**函数：**getMusicURL，

**参数：**

songmid: 歌曲 MID（字符串）

quality: 歌曲品质（字符串），有 m4a、128、320（默认）可选，其中 128、320 为 MP3 格式，默认为 320

server: 默认为 0，若为 0 使用 http://ws.stream.qqmusic.qq.com 服务器

若为 1 使用 http://isure.stream.qqmusic.qq.com 服务器

若为 2 使用 http://dl.stream.qqmusic.qq.com 服务器（非官方提供）

### 获取歌单歌曲信息

**原 API：**https://i.y.qq.com/qzone-music/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg

**函数：**getSongList，

**参数：**

categoryID：歌单 ID

### 获取歌单名称

**原 API：**https://i.y.qq.com/qzone-music/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg

**函数：**getSongListName，

**参数：**

categoryID：歌单 ID

### 用关键词搜索歌曲

**原 API：**https://u.y.qq.com/cgi-bin/musicu.fcg

**函数：**searchWithKeyword，

**参数：**

keyword: 关键词（字符串）

searchType: 搜索结果类型（默认为 0），0 为歌曲，2 为专辑，3 为歌单，4 为 MV，7 为歌词，8 为用户

resultNum: （每页）结果数量（默认为 50）

pageNum: 页面序号（不是页数，默认为 1）

### 获取歌曲歌词

**原 API：**https://i.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg

**函数：**getSongLyric，

**参数：**

songmid: 歌曲 MID（字符串）

parse: 是否需要解析歌词（默认为 false)，若为 true 则调用 parseLyric 函数对请求到的歌词字符串进行解析。解析效果见 parseLyric 的注释。

### 获取专辑歌曲信息

**原 API：**https://i.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg

**函数：**getAlbumSongList，

**参数：**

albummid: 专辑的 MID

### 获取专辑名称

**原 API：**https://i.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg

**函数：**getAlbumName

**参数：**

albummid: 专辑的 MID

### 获取 MV 信息

**原 API：**https://u.y.qq.com/cgi-bin/musicu.fcg

**函数：**getMVInfo

**参数：**

vid: MV 的 VID

本 API 返回的 Data 已是最简的 JSON，所以无论 origin 是否为 true 都直接返回 data。

### 获取歌手信息

**原 API：**https://u.y.qq.com/cgi-bin/musicu.fcg

**函数：**getSingerInfo

**参数：**

singermid: 歌手 MID

### 附赠小工具：获取专辑封面图

**函数：**getAlbumCoverImage

**参数：**

albummid: 专辑的 MID

### 附赠小工具：解析歌词

**函数：**parseLyric

**参数：**

data：从 QQ 音乐申请来的数据

**解析格式：**对象。ti、ar、al、by、offset 的有无取决于 QQ 音乐

ti: (title) 标题

ar：(artist) 创作者

al: (album) 专辑

by: 没看过有内容的

offset: 偏移量，没看过不为 0 的，应该是针对歌词时间而言的。

count：歌词数量，为整型

haveTrans: 是否有翻译，为布尔值

lyric：列表。列表内容为对象，每个对象由 time、lyric 和 trans 三个键构成。time 为时间，lyric 为歌词，trans 为翻译。

## 更多

API 来源为 Listen 1 与 y.qq.com 官网。练手项目，可能有缘再维护。

这里先~~磕个头~~感谢 Listen 1。

## 有关批量下载

这里分享一下我批量下载的方法：在保证有 QQ 音乐 VIP 的前提下登录官网 y.qq.com。然后安装 Listen 1 插件，播放你想批量下载的歌单。把这个项目中的 qq-music-api.js 全文复制到控制台（记得把 export 删了）

然后在网络检查中拿到歌单请求 URL。在控制台中再请求一遍（如果你不想用 fetch，Listen 1 自带 axios）就能获取歌单所有歌曲的 mid。最后调用 getMusicURL 拿到 URL 即可。想方便一点可以搭配 window.open 及 IDM 自动嗅探使用（建议一次下载 20 首歌），或者有 JS 大佬还有其它方法。
