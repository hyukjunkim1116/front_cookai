async function handleSignUp() {
	const btn = document.getElementById("button")
	btn.disabled=true
	const span = document.createElement("span");
    span.setAttribute("id", "spinner-span");
    span.setAttribute("class", "spinner-border spinner-border-sm");
    span.setAttribute("role", "status");
    span.setAttribute("aria-hidden", "true");
    btn.appendChild(span);
	const email = document.getElementById("email").value;
	const firstPassword = document.getElementById("first_password").value;
	const secondPassword = document.getElementById("second_password").value;
	const username = document.getElementById("username").value;
	if (firstPassword === secondPassword) {
		const response = await fetch(`${BACKEND_BASE_URL}/users/`, {
			headers: {
				"content-type": "application/json"
			},
			method: "POST",
			body: JSON.stringify({
				email: email,
				password: firstPassword,
				second_password: secondPassword,
				username: username
			})
		});
		if (response.status == 400) {
			var alertMsg = "";
			const response_json = await response.json();
			var list = Object.values(response_json);
			list.forEach((element) => {
				if (element[0] == "password") {
					alertMsg +=
						"비밀번호는 8자리이상이어야 하며 하나이상의 숫자,알파벳,특수문자(!@#$%^&*())들로 구성됩니다.\n";
				} else {
					alertMsg += `${element}\n`;
				}
			});
			alert(alertMsg);
			btn.disabled=false
			btn.firstElementChild.remove()
		} else {
			alert(
				"입력하신 이메일을 확인하여 인증을 진행하고 회원가입을 완료해주세요!"
			);
			window.location.replace(`${FRONT_BASE_URL}/login.html`);
			return response;
		}
	} else {
		alert("비밀번호가 일치하지 않습니다.");
		btn.disabled=false
		btn.firstElementChild.remove()
	}
}
const passwordToggle = () => {
	const passwordToggleBtn = document.querySelector(".check-password");
	const firstPassword = document.getElementById("first_password");
	const secondPassword = document.getElementById("second_password");
	if (passwordToggleBtn.checked) {
		firstPassword.type = "text";
		secondPassword.type = "text";
	} else {
		firstPassword.type = "password";
		secondPassword.type = "password";
	}
};

async function loaderFunction() {
	checkLogin();
}
