// 로그인 폼 다 쓰고 로그인 눌렀을 때 실행되는 함수
async function handleLoginBtn() {
	const response = await handleLogin();

	if (response.status == 200) {
		const response_json = await response.json();

		localStorage.setItem("access", response_json.access);
		localStorage.setItem("refresh", response_json.refresh);

		const base64Url = response_json.access.split(".")[1];
		const base64 = base64Url.replace(/-/g, "+");
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split("")
				.map(function (c) {
					return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
				})
				.join("")
		);
		localStorage.setItem("payload", jsonPayload);
		alert("환영합니다!");
		window.location.replace(`${FRONT_BASE_URL}/`);
	} else {
		alert("회원정보가 일치하지 않습니다!");
	}
}
const login = document.getElementById("login-btn");
login.addEventListener("click", () => {
	handleLoginBtn();
});

const googleLoginBtn = document.getElementById("social-btn-google");
googleLoginBtn.addEventListener("click", () => {
	googleLogin();
});
const kakaoLoginBtn = document.getElementById("social-btn-kakao");
kakaoLoginBtn.addEventListener("click", () => {
	kakaoLogin();
});
const naverLoginBtn = document.getElementById("social-btn-naver");
naverLoginBtn.addEventListener("click", () => {
	naverLogin();
});
window.onload = async function () {
	checkLogin();
};
