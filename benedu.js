/*
 * 제대로 된 패키징 시스템이 필요할듯. 뭔가 웹팩 같은거.
 * 덤으로 파이어폭스에서는 alert를 못씀.
 * 개발진:
 *   윤여민 [웹플 17기]
 */

(() => {
	// 아래 변수를 true로 바꾸면 각종 검사를 비활성화 합니다.
	// 권장하지 않습니다.
	const forceEnable = false;
	
	function sha1(str) {
		//  discuss at: http://phpjs.org/functions/sha1/
		// original by: Webtoolkit.info (http://www.webtoolkit.info/)
		// improved by: Michael White (http://getsprink.com)
		// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		//    input by: Brett Zamir (http://brett-zamir.me)
		//   example 1: sha1('Kevin van Zonneveld');
		//   returns 1: '54916d2e62f65b3afa6e192e6a601cdbe5cb5897'

		var rotate_left = function(n, s) {
			var t4 = (n << s) | (n >>> (32 - s));
			return t4;
		};

		var cvt_hex = function(val) {
			var str = '';
			var i;
			var v;

			for (i = 7; i >= 0; i--) {
				v = (val >>> (i * 4)) & 0x0f;
				str += v.toString(16);
			}
			return str;
		};

		var blockstart;
		var i, j;
		var W = new Array(80);
		var H0 = 0x67452301;
		var H1 = 0xEFCDAB89;
		var H2 = 0x98BADCFE;
		var H3 = 0x10325476;
		var H4 = 0xC3D2E1F0;
		var A, B, C, D, E;
		var temp;

		var str_len = str.length;

		var word_array = [];
		for (i = 0; i < str_len - 3; i += 4) {
			j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 | str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3);
			word_array.push(j);
		}

		switch (str_len % 4) {
			case 0:
				i = 0x080000000;
				break;
			case 1:
				i = str.charCodeAt(str_len - 1) << 24 | 0x0800000;
				break;
			case 2:
				i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000;
				break;
			case 3:
				i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) << 8 | 0x80;
			break;
		}

		word_array.push(i);

		while ((word_array.length % 16) != 14) {
			word_array.push(0);
		}

		word_array.push(str_len >>> 29);
		word_array.push((str_len << 3) & 0x0ffffffff);

		for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
			for (i = 0; i < 16; i++) {
				W[i] = word_array[blockstart + i];
			}
			for (i = 16; i <= 79; i++) {
				W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
			}

			A = H0;
			B = H1;
			C = H2;
			D = H3;
			E = H4;

			for (i = 0; i <= 19; i++) {
				temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
				E = D;
				D = C;
				C = rotate_left(B, 30);
				B = A;
				A = temp;
			}

			for (i = 20; i <= 39; i++) {
				temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
				E = D;
				D = C;
				C = rotate_left(B, 30);
				B = A;
				A = temp;
			}

			for (i = 40; i <= 59; i++) {
				temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
				E = D;
				D = C;
				C = rotate_left(B, 30);
				B = A;
				A = temp;
			}

			for (i = 60; i <= 79; i++) {
				temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
				E = D;
				D = C;
				C = rotate_left(B, 30);
				B = A;
				A = temp;
			}

			H0 = (H0 + A) & 0x0ffffffff;
			H1 = (H1 + B) & 0x0ffffffff;
			H2 = (H2 + C) & 0x0ffffffff;
			H3 = (H3 + D) & 0x0ffffffff;
			H4 = (H4 + E) & 0x0ffffffff;
		}

		temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
		return temp.toLowerCase();
	}
	
	function hashScript(src) {
		return fetch(src, {
				credentials: 'same-origin',
				method: 'GET',
				cache: 'default'
			}).then(res => {
				return res.arrayBuffer();
			}).then(x => {
				return sha1(x);
			});
	}
	
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
				const remainMS = data.RemainSeconds * 1000;
				const randomTiming = Math.random() * 5000 + 200;
				setTimeout(extendSession, Math.max(0, Math.min(randomTiming, remainMS - 1000)));
			}
			filter.write(encoder.encode(JSON.stringify(data)));
			filter.close();
		}
	}
	
	function init() {
		browser.webRequest.onBeforeRequest.addListener(
			interceptRequest,
			{ urls: ["https://www.benedu.co.kr/SessionExpire/CheckSession"] },
			["blocking"]
		);
		console.log('Better Benedu 시동 완료.');
	}
	
	if(forceEnable) {
		init();
		return;
	}
	
	hashScript('https://www.benedu.co.kr/Scripts/benedu/benedu.sessionmanager.js')
		.then((hash) => {
			if(hash !== '92b404e556588ced6c1acd4ebf053f6809f73a93') {
				alert('Better Benedu 애드온의 마지막 업데이트 이후로 베네듀의 스크립트가 수정되었습니다.\n안전을 위해 애드온을 비활성화합니다.\n프로그래밍을 잘하는 친구에게 이 애드온을 수정해서 PR해 달라고 하세요.');
				throw 'BeneduScriptVersionError';
			}
		}).then(() => {
			init();
		});
})();