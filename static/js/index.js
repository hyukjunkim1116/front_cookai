import {
	handleLogout,
	getKakaoToken,
	getGoogleToken,
	getNaverToken,
	BACKEND_DEVELOP_URL
} from "./api.js";

export const logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", () => {
	handleLogout();
});

// 받아온 토큰을 로컬 스토리지에 저장
// 에러 발생 시, 에러 문구를 띄워주고 이전 페이지(로그인페이지)로
export function setLocalStorage(response) {
	if (response.status === 200) {
		localStorage.setItem("access", response_json.access);
		localStorage.setItem("refresh", response_json.refresh);
		const base64Url = response_json.access.split(".")[1];
		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split("")
				.map(function (c) {
					return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
				})
				.join("")
		);
		localStorage.setItem("payload", jsonPayload);
		window.location.reload();
	} else {
		alert(response_json["error"]);
		window.history.back();
	}
}
// 로그인 되어있다면(localstorage에 토큰이 있다면) 로그인 되어있으므로 pass
// 토큰이 없고, url에 파라미터가 있다면, 해당 값을 판별해서 해당하는 함수를 호출
if (localStorage.getItem("payload")) {
} else if (location.href.split("=")[1]) {
	let code = new URLSearchParams(window.location.search).get("code");
	let state = new URLSearchParams(window.location.search).get("state");
	let hashParams = new URLSearchParams(window.location.hash.substr(1));
	let google_token = hashParams.get("access_token");
	if (code) {
		if (state) {
			getNaverToken(code, state);
		} else {
			getKakaoToken(code);
		}
	} else if (google_token) {
		getGoogleToken(google_token);
	}
}
