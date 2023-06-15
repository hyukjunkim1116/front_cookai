// 로그인 상태에서 로그인, 회원가입 페이지 접속 시 홈으로 이동하는 함수
function checkLogin() {
	const payload = localStorage.getItem("payload");
	if (payload) {
		window.location.replace(`${FRONT_BASE_URL}/`);
	}
}
// 비로그인 상태에서 글쓰기 페이지 접속 시 홈으로 이동하는 함수
function checkNotLogin() {
	const payload = localStorage.getItem("payload");
	if (payload == null) {
		window.location.replace(`${FRONT_BASE_URL}/`);
	}
}
// 강제 로그아웃
function forceLogout() {
	const payload = localStorage.getItem("payload");
	let current_time = String(new Date().getTime()).substring(0, 10);
	if (payload) {
		const payload_parse = JSON.parse(payload).exp;
		if (payload_parse < current_time) {
			handleLogout();
		} else {
			return;
		}
	}
}
// 로그아웃
function handleLogout() {
	localStorage.removeItem("access");
	localStorage.removeItem("refresh");
	localStorage.removeItem("payload");
	window.location.replace(`${FRONT_BASE_URL}/`);
}
