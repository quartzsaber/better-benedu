(() => {
	function extendSession() {
		fetch('https://www.benedu.co.kr/SessionExpire/ExtnesioSession', {
				credentials: 'same-origin',
				method: 'POST',
				cache: 'no-cache'
			}).then(res => {
				return res.json();
			}).then(x => {
				console.log(x);
				if(x.Type === 'sessionNone')
					setTimeout(() => alert('강제 로그아웃 되었습니다! 새로고침 해 주세요.\n버그 제보도 부탁드립니다.\n-Better Benedu-'), 0);
				remainSecond = x.extensionSeconds;
			});
	}
	
	function interceptRequest(details) {
		let filter = browser.webRequest.filterResponseData(details.requestId);
		let incoming = [];

		filter.ondata = event => {
			incoming.push(event.data);
		}
		
		filter.onstop = event => {
			let decoder = new TextDecoder("utf-8");
			let encoder = new TextEncoder();
			let text = '';
			for(let i=0; i<incoming.length; i++) {
				opt = {};
				if(i !== incoming.length - 1)
					opt.stream = true;
				text += decoder.decode(incoming[i], opt);
			}
			
			let data = JSON.parse(text);
			if(data.Type === 'Popup') {
				data.Type = 'Ignore';
				setTimeout(extendSession, Math.random() * 2000 + 1000);
			}
			filter.write(encoder.encode(JSON.stringify(data)));
			filter.close();
		}
	}
	
	browser.webRequest.onBeforeRequest.addListener(
		interceptRequest,
		{ urls: ["https://www.benedu.co.kr/SessionExpire/CheckSession"] },
		["blocking"]
	);
	console.log('Better Benedu Ready.');
})();