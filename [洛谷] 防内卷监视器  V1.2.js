let oConfig = {
	"Luogu": {
		"UserList": ["diqiuyi", "seanlsy"], // 用户列表
		"ProblemNum": 20, // 查看最后做了几道题
		"fetchTime": 10 * 1000, // 两次检测间隔（单位毫秒）
		"AlertType": "system", // 提示信息: system (系统) | alert (网页)
		"MultiRecord": false, // 是否显示多次提交记录
		"TimeSortRecord": true, // 是否按时间排序
	}, 
};

((o) => {
	let Sleep = o["Sleep"] = (T) => (T != 0) ? (new Promise((R) => setTimeout(R, T))) : (null);
	let EncryptionStr = (() => { let res = window['MD5'] || window['btoa'] || ((str) => str.toString()); return res; })();
	let MurmurHash3 = (Str) => {
		let i = 0, hash;
		for (i, hash = 1779033703 ^ Str.length; i < Str.length; i++) {
			let bitwise_xor_from_character = hash ^ Str.charCodeAt(i);
			hash = Math.imul(bitwise_xor_from_character, 3432918353);
			hash = hash << 13 | hash >>> 19;
		} return () => {
			hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
			hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
			return (hash ^= hash >>> 16) >>> 0;
		}
	};
	let Mulberry32 = (RandVal) => {
		return () => {
			let for_bit32_mul = RandVal += 0x6D2B79F5;
			let cast32_one = for_bit32_mul ^ for_bit32_mul >>> 15;
			let cast32_two = for_bit32_mul | 1;
			for_bit32_mul = Math.imul(cast32_one, cast32_two);
			for_bit32_mul ^= for_bit32_mul + Math.imul(for_bit32_mul ^ for_bit32_mul >>> 7, for_bit32_mul | 61);
			return ((for_bit32_mul ^ for_bit32_mul >>> 14) >>> 0) / 4294967296;
		}
	};

	let Salt = "TestData" + Math.random(); // 种子码，可修改
	let Rnd = Mulberry32(MurmurHash3(EncryptionStr(Salt))());

	let I = o["I"] = (X, ret) => isNaN(ret = parseInt(X)) ? (0) : ret;
	let L = o["L"] = (X) => BigInt(Number.isInteger(Number(X)) ? X : I(X));
	let shuffle = o["shuffle"] = (Arr = []) => Arr.sort(() => Rnd() - 0.5);

	o["DownloadFile"] = (FileName, Content, ContentType = "application/octet-stream; Charset=utf-8") => {
		var a = document["createElement"]("a"), blob = new Blob([Content], { "type": ContentType });
		a["href"] = window["URL"]["createObjectURL"](blob), a["download"] = FileName, a["click"]();
	}
	o["UpLoadFile"] = async (ContentType = "application/x-www-form-urlencoded; Charset=utf-8") => new Promise((Resolve, Error) => {
		var Input = document["createElement"]("input");
		Input["type"] = "file", Input["accept"] = ContentType, Input["multiple"] = false, Input["click"]();
		Input["onchange"] = () => Input["files"][0]["text"]()["then"]((Data) => Resolve(Data))["catch"]((Reason) => Error(Reason));
	});

	// 将数组转换为基本类型
	o["ati"] = (Arr = []) => Arr.flat().map((X) => I(X));
	o["atri"] = (...Arr) => Arr.flat().map((X) => I(X));
	o["atL"] = (Arr = []) => Arr.flat().map((X) => L(X));
	o["atrL"] = (...Arr) => Arr.flat().map((X) => L(X));

	// 随机数字/字符
	o["rInt"] = (l = 0, r = 0) => I(l) + I(Rnd() * (I(r) - I(l) + 1));
	o["rLong"] = (l = 0n, r = 0n) => {
		let Q = L(r) - L(l), S = Q.toString(), len = S.length, ret = "", f = false;
		for (let i = 0, j; i < len; ++i) j = rInt(0, f ? 9 : S[i]), f |= (j != S[i]), ret += j;
		return L(l) + L(ret);
	};
	o["rStr"] = (len, c = "abcdefghijklmnopqrstuvwxyz") => {
		let ret = ""; for (let i = 1; i <= len; ++i) ret += c[o["rInt"](0, c.length - 1)]; return ret;
	};

	// 将数组转换为文本空格形式，并添加换行
	o["ats"] = (Arr = []) => Arr.flat().join(" ") + "\n";
	o["atrs"] = (...Arr) => Arr.flat().join(" ") + "\n";

	// 定时发包装置
	o["oSender"] = (function(){
		let Sleep = (T) => new Promise((R) => setTimeout(R, T));
		let PromiseWait = (F, WaitT) => new Promise((R) => {(async () => R(await F()))(), (async () => R(await Sleep(WaitT), null))();});
		let ret = {
			Sleep: Sleep, PromiseWait: PromiseWait,
			MaxWaitTime: 1500, WaitTimeSend: 1500, TQ: [],
			Timer: null,
			Init: (self) => (self = ret, self["TQ"] = []),
			Start: (self) => {
				if ((self = ret)["Timer"] != null) return; self["Timer"] = 0;
				(async function () {
					let N = Date["now"]();
					self["TQ"]["length"] && (await PromiseWait(async () => (await self["TQ"][0]["f"]["apply"](self["TQ"][0]["f"], self["TQ"][0]["ar"])), self["MaxWaitTime"]), self["TQ"]["splice"](0, 1));
					(self["Timer"] != null) && (self["Timer"] = setTimeout(arguments.callee, self["WaitTimeSend"] - (Date["now"]() - N))); // 发包冷却
				})();
			},
			Stop: () => {
				clearTimeout(ret["Timer"]), ret["Timer"] = null;
			},
			Clear: () => {
				ret["TQ"]["length"] = 0;
			},
			addTask: (f, arr, self) => (self = ret, self["TQ"]["push"]({f: f, ar: arr})), 
			addTaskPromise: (f, arr, self) => new Promise((R) => { self = ret, self["TQ"]["push"]({ f: async (...Arr) => (await f(...Arr), R()), ar: arr }); })
		};
		return ret;
	})();
	o["$Get"] = async (URL) => (await fetch(URL))["text"]();

})(window);

let dGet = {
	"WarnAlert": (Content) => {
		switch (oConfig["Luogu"]["AlertType"]) {
			case "system": Notification["requestPermission"]()["then"]((Result) => {if (Result == "granted") new Notification(Content); }); break;
			case "alert": alert(Content); break;
		}
	}, 
	"Luogu": {
		Reg: /decodeURIComponent\(".*?"\)/, UserRecord: {}, FetchID: 0, 
		Decode: (Content) => { // 将 API 内容转为 JSON 格式（初次提取）
			let self = dGet["Luogu"], d = self["Reg"]["exec"](Content)[0];
			return JSON["parse"](decodeURIComponent(d["substr"](20, d["length"] - 22)));
		}, 
		GetList: (Obj) => Obj["currentData"]["records"]["result"], // 将 JSON 内进一步提取，变为列表形式
		$Obj: (List, UName = "未知") => List["map"]((Obj) => ({ // 将列表进一步变为已知格式
			"Pid": Obj["problem"]["pid"], "PTitle": Obj["problem"]["title"], "PDif": Obj["problem"]["difficulty"], 
			"Rid": Obj["id"], "UName": (Obj["user"] ? Obj["user"]["name"] : UName), "Uid": (Obj["user"] ? Obj["user"]["uid"] : "未知"), "SubTime": Obj["submitTime"] * 1000, 
		})), 
		Push: (Obj) => {
			let self = dGet["Luogu"], r = self["UserRecord"], UName = Obj["UName"], Pid = Obj["Pid"];
			if (!r[UName]) r[UName] = (new Map());
			if (!r[UName]["has"](Pid)) r[UName]["set"](Pid, []);
			r[UName]["get"](Pid)["push"](Obj);
			// r[UName]["get"](Pid)["sort"]((A, B) => Number(B["Rid"]) - Number(A["Rid"]));
		}, 
		Merge: (List) => {
			let self = dGet["Luogu"], r = self["UserRecord"];
			for (let o of List) self["Push"](o);
		}, 
		$URL: (UserName, Page = 1) => `https://www.luogu.com.cn/record/list?user=${UserName}&page=${Page}&status=12`, 
		FetchOneUserList: async (UName) => {
			let self = dGet["Luogu"], r = self["UserRecord"], cnt = 1, result = null;
			let RecordObj = self["Decode"](await $Get(self["$URL"](UName)))["currentData"]["records"];
			let RecordNum = RecordObj["count"], perPage = RecordObj["perPage"], PageNum = Math["ceil"](RecordNum / perPage);
			while (cnt <= PageNum) {
				if (r[UName] && r[UName]["size"] >= oConfig["Luogu"]["ProblemNum"]) break;
				await oSender["addTaskPromise"](async () => {
					result = self["Decode"](await $Get(self["$URL"](UName, cnt)));
					self["Merge"](self["$Obj"](self["GetList"](result), UName));
				}, []), ++cnt;
			}
		}, 
		FetchAllUsetList: async (CheckContinue = () => true, CallBack = () => {}) => {
			let self = dGet["Luogu"];
			for (let o of oConfig["Luogu"]["UserList"]) if (CheckContinue(o)) await oSender["addTaskPromise"](async (uName) => (await self["FetchOneUserList"](uName)), [o]), CallBack(o);
		}, 
		FetchNewUserList: async (UName) => {
			let self = dGet["Luogu"], r = self["UserRecord"], cnt = 1, ret = [[], []], PTime = {}; if (!r[UName]) return (await self["FetchOneUserList"](UName)), [[], []];
			let RecordObj = self["Decode"](await $Get(self["$URL"](UName)))["currentData"]["records"];
			let RecordNum = RecordObj["count"], perPage = RecordObj["perPage"], PageNum = Math["ceil"](RecordNum / perPage);
			for (let o of r[UName]) o[1] = [...(new Map(o[1]["map"]((_) => [_["Rid"], _])))["values"]()]["sort"]((A, B) => Number(B["Rid"]) - Number(A["Rid"])), PTime[o[0]] = o[1][0]["Rid"], r[UName]["set"](o[0], o[1]);
			while (cnt <= PageNum) {
				let result = self["$Obj"](self["GetList"](self["Decode"](await $Get(self["$URL"](UName, cnt)))), UName), flag = false;
				for (let o of result) if (!PTime[o["Pid"]]) ret[0]["push"](o), flag = true;
				for (let o of result) if (o["Rid"] > PTime[o["Pid"]]) ret[1]["push"](o), flag = true;
				if (!flag) break; self["Merge"](result), ++cnt;
			}
			return ret;
		}, 
		GetOneUserList: (UName) => {
			let self = dGet["Luogu"], r = self["UserRecord"], ret = []; if (!r[UName]) return ret;
			for (let o of r[UName]) {
				o[1] = [...(new Map(o[1]["map"]((_) => [_["Rid"], _])))["values"]()]["sort"]((A, B) => Number(B["Rid"]) - Number(A["Rid"]));
				if (oConfig["Luogu"]["MultiRecord"]) ret["push"](...o[1]), r[UName]["set"](o[0], o[1]);
				else ret["push"](o[1][0]), r[UName]["set"](o[0], o[1]);
			};
			return ret["sort"]((A, B) => Number(B["Rid"]) - Number(A["Rid"]));
		}, 
		"DownloadRecord": () => {
			let self = dGet["Luogu"], r = self["UserRecord"], ret = [];
			for (let UName in r) r[UName]["forEach"]((Arr, Pid) => (ret = ret.concat(Arr)));
			ret = [...(new Map(ret["map"]((_) => [_["Rid"], _])))["values"]()]["sort"]((A, B) => Number(B["Rid"]) - Number(A["Rid"]));
			DownloadFile(`[Luogu] 提交记录文件 ${(new Date())["toLocaleString"]()}.json`, JSON["stringify"](ret));
		}, 
		"UploadRecord": async () => {
			let self = dGet["Luogu"], r = self["UserRecord"];
			let ArrJson = JSON["parse"](await UpLoadFile()), UserArr = (new Set(oConfig["Luogu"]["UserList"]));
			for (let o of ArrJson) UserArr["add"](o["UName"]); oConfig["Luogu"]["UserList"] = [...UserArr];
			self["Merge"](ArrJson), StopFetchLoop(), RUN(), ShowAllUserList();
		}
	}
}

let RUN = async () => {
	let $ = (a) => document.getElementById(a), 
		$n = (a) => document.createElement(a), 
		NewEle = function(h, b, d, a, e, f, g, c) {
			g = $n(b), h && (g.id = h), d && (g.style.cssText = d);
			if (a) { for (c in a) g[c] = a[c]; }
			if (f) { for (c in f) g.setAttribute(c, f[c]); }
			e && e.appendChild(g); return g;
		};


	document.body.innerHTML = ""; const EDAll = document.body;

	let dPageTitle = NewEle("dPageTitle", "h1", "text-align:center; color:red; font-family:Microsoft Yahei", { innerHTML: "内卷监视工具" }, EDAll);
	let dPageSubTitle = NewEle("dPageSubTitle", "b", "text-align:center;font-family:FangSong", { innerHTML: "运筹首页之中，偷袭千里之外&#128517;" }, EDAll);
	let dSelectDiv = NewEle("dSelectDiv", "div", "position:relative;left:10px;top:10px;width:100%;display:flex;", 0, EDAll);
	let sSelectUser = NewEle("sSelectUser", "select", "height:30px;width:305px;text-align:center;border-radius:10px;background:rgba(0,0,0,0.733);color:rgb(255,255,255);white-space:pre;font-family:FangSong;font-size:15px;", 0, dSelectDiv, { size: 1, title: "筛选用户" });

	sSelectUser["add"](new Option("All", "*")), sSelectUser["selectedIndex"] = 0;
	for (let o of oConfig["Luogu"]["UserList"]) sSelectUser["add"](new Option(o, o));
	sSelectUser["onchange"] = function () { ShowAllUserList(); console.log("筛选 " + this["options"][this["selectedIndex"]]["value"]); };

	let tUserProblemTable = NewEle("tUserProblemTable", "table", "position:relative;min-height:150px;left:10px;top:10px;width:calc(100% - 20px);white-space:nowrap;line-height:20px;font-size:12px;text-align:center;", {}, EDAll, { "border": "0", "cellspacing": "0", "cellpadding": "0" });
	let tUserProblemTbody = NewEle("tUserProblemTbody", "tbody", "display:block;min-height:150px;width:calc(100% - 20px);background:rgba(0,0,0,0.05);", 0, tUserProblemTable);
	let DifCol = ["rgb(171,171,171)", "rgb(254,76,97)", "rgb(243,156,17)", "rgb(255,193,22)", "rgb(82,196,26)", "rgb(52,152,219)", "rgb(157,61,207)", "rgb(14,29,105)"];

	let dChoseShowType = NewEle("dChoseShowType", "div", "margin-left:50px;line-height:40px;color:rgb(254,76,97);font-weight:bold;font-size:15px;font-family:幼圆;white-space:pre;word-spacing:2.5px", 0, dSelectDiv);
	let dChoseMultiRecordLable = NewEle("dChoseMultiRecordLable", "label", "", 0, dChoseShowType), dChoseMultiRecord = NewEle("dChoseMultiRecord", "input", "", { "type": "checkbox", "name": "dChoseMultiRecord" }, dChoseMultiRecordLable); NewEle("", "text", "", { "innerHTML": " 显示重复		" }, dChoseMultiRecordLable);
	let dChoseTimeSortRecordLable = NewEle("dChoseTimeSortRecordLable", "label", "", 0, dChoseShowType), dChoseTimeSortRecord = NewEle("dChoseTimeSortRecord", "input", "", { "type": "checkbox", "name": "dChoseTimeSortRecord" }, dChoseTimeSortRecordLable); NewEle("", "text", "", { "innerHTML": " 按时间排序		" }, dChoseTimeSortRecordLable);

	if (oConfig["Luogu"]["MultiRecord"]) dChoseMultiRecord["checked"] = true; dChoseMultiRecord["onchange"] = function () { oConfig["Luogu"]["MultiRecord"] = this["checked"], ShowAllUserList(); };
	if (oConfig["Luogu"]["TimeSortRecord"]) dChoseTimeSortRecord["checked"] = true; dChoseTimeSortRecord["onchange"] = function () { oConfig["Luogu"]["TimeSortRecord"] = this["checked"], ShowAllUserList(); };

	let dUploadRecord = NewEle("dUploadRecord", "input", "margin-left:10px;width:125px;height:35px;border-radius:12.5px;white-space:pre;background:rgba(0,0,0,0.733);color:rgb(255,255,255);font-family:Regular;font-size:20px;cursor:pointer;visibility:visible;white-space:pre;", {"onclick": () => dGet["Luogu"]["UploadRecord"]() }, dSelectDiv, { "type": "button", "value": "加载记录" });
	let dDownloadRecord = NewEle("dDownloadRecord", "input", "margin-left:10px;width:125px;height:35px;border-radius:12.5px;white-space:pre;background:rgba(0,0,0,0.733);color:rgb(255,255,255);font-family:Regular;font-size:20px;cursor:pointer;visibility:visible;white-space:pre;", {"onclick": () => dGet["Luogu"]["DownloadRecord"]() }, dSelectDiv, { "type": "button", "value": "保存记录" });
	let dCheckLoopButton = NewEle("dCheckLoopButton", "input", "margin-left:10px;width:125px;height:35px;border-radius:12.5px;white-space:pre;background:rgba(0,0,0,0.733);color:rgb(255,255,255);font-family:Regular;font-size:20px;cursor:pointer;visibility:visible;white-space:pre;", {
			"onclick": () => {
				if (oSender["Timer"]) dCheckLoopButton["value"] = "开始获取", StopFetchLoop();
				else dCheckLoopButton["value"] = "停止获取", StartFetchLoop();
			} 
		}, dSelectDiv, { "type": "button", "value": "开始获取" });

	window["tAddTitleTable"] = (Body, Arr = []) => {
		Body["innerHTML"] = ""; // 清空原有表格
		let dTitleStyle = "font-size:20px;font-family:Microsoft Yahei;text-align:center;background:transparent;color:rgb(0,0,0);"; // 插入 TR
		let dBodyStyle = "font-size:15px;font-family:Microsoft Yahei;text-align:center;background:transparent;color:rgb(0,0,0);"; // 插入 TR
		let BodyTR = NewEle("", "tr", "color:#060;font-weight:bold;height:40px;display:table;width:100%;table-layout:fixed;", 0, Body);
		let TitleA = NewEle("", "td", dTitleStyle, 0, BodyTR, { width: "20%" }), TitleB = NewEle("", "td", dTitleStyle, 0, BodyTR, { width: "40%" });
		let TitleC = NewEle("", "td", dTitleStyle, 0, BodyTR, { width: "20%" }), TitleD = NewEle("", "td", dTitleStyle, 0, BodyTR, { width: "20%" });
		let dTSeparate = NewEle("", "tr", "height:2px;background-color:rgb(0,0,0,0.5);display:table;width:100%;table-layout:fixed;", { /* "innerHTML": "<td colspan=\"2\"></td>" */ }, Body); // 分割线
		TitleA["innerHTML"] = "用户名", TitleB["innerHTML"] = "题目名称", TitleC["innerHTML"] = "提交记录", TitleD["innerHTML"] = "通过时间";

		for (let O of Arr) {
			let dTime = (new Date(O["SubTime"]));
			let TBodyTR = NewEle("", "tr", "color:#060;font-weight:bold;height:20px;display:table;width:100%;table-layout:fixed;", 0, Body); // 新行
			let TBodyA = NewEle("", "td", dBodyStyle + "cursor:pointer;color:rgb(254,76,97);", {"width": "20%"}, TBodyTR, { "onclick": `window["open"]("https://www.luogu.com.cn/user/${O["Uid"]}");` });
			let TBodyB = NewEle("", "td", dBodyStyle + "cursor:pointer;color:" + DifCol[O["PDif"]], {"width": "40%"}, TBodyTR, { "onclick": `window["open"]("https://www.luogu.com.cn/problem/${O["Pid"]}");` });
			let TBodyC = NewEle("", "td", dBodyStyle + "cursor:pointer;color: rgb(82,196,26);", {"width": "20%"}, TBodyTR, { "onclick": `window["open"]("https://www.luogu.com.cn/record/${O["Rid"]}");` });
			let TBodyD = NewEle("", "td", dBodyStyle + "cursor:pointer;", {"width": "20%"}, TBodyTR, { "onclick": `window["open"]("https://www.timeanddate.com/worldclock/fixedtime.html?day=${dTime["getDate"]()}&month=${dTime["getMonth"]() + 1}&year=${dTime["getFullYear"]()}&hour=${dTime["getHours"]()}&min=${dTime["getMinutes"]()}&sec=${dTime["getSeconds"]()}&p1=166");` });

			TBodyA["innerHTML"] = O["UName"], TBodyB["innerHTML"] = `${O["Pid"]} ${O["PTitle"]}`;
			TBodyC["innerHTML"] = O["Rid"], TBodyD["innerHTML"] = `${dTime["toLocaleDateString"]()} ${dTime["toLocaleTimeString"]()}`; 
		}
	}, window["ShowAllUserList"] = () => {
		let ret = [], Opt = sSelectUser["options"][sSelectUser["selectedIndex"]]["value"], Arr = ["*"]; 
		for (let o of oConfig["Luogu"]["UserList"]) if (Arr["includes"](Opt) || o == Opt) ret = ret["concat"](dGet["Luogu"]["GetOneUserList"](o));
		if (oConfig["Luogu"]["TimeSortRecord"]) ret = ret["sort"]((A, B) => Number(B["Rid"]) - Number(A["Rid"]));
		tAddTitleTable(tUserProblemTbody, ret);
	};

	NewEle("", "br", "", 0, EDAll), tAddTitleTable(tUserProblemTbody), ShowAllUserList(); // 先创建面板，再刷新

	window["StartFetchLoop"] = async () => {
		let ID = dGet["Luogu"]["FetchID"] = Math["random"](); oSender["Start"](); 

		await dGet["Luogu"]["FetchAllUsetList"](() => (dGet["Luogu"]["FetchID"] == ID), ShowAllUserList); // 先获取所有人

		while (true) {
			if (dGet["Luogu"]["FetchID"] != ID) break;

			for (let _ of oConfig["Luogu"]["UserList"]) await oSender["addTaskPromise"](async (o) => {
				if (dGet["Luogu"]["FetchID"] != ID) return;
				let [Arr0, Arr1] = await dGet["Luogu"]["FetchNewUserList"](o), Num = (new Map(Arr0["map"]((_) => [_["Rid"], null])))["size"];
				if (Num != 0) dGet["WarnAlert"](`${o} 刚刚卷了 ${Num} 道题！`);
				if (Arr0["length"] + Arr1["length"] > 0) ShowAllUserList();
			}, [_]);

			if (dGet["Luogu"]["FetchID"] == ID) await Sleep(oConfig["Luogu"]["fetchTime"]);
		}
	}, window["StopFetchLoop"] = async () => {
		dGet["Luogu"]["FetchID"] = 0;
		oSender["Clear"](), oSender["Stop"]();
	};
};

RUN();
