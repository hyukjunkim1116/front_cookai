import { handleSignUp } from "./api.js";

export function setThumbnail(event) {
	let reader = new FileReader();

	reader.onload = function (event) {
		let img = document.createElement("img");
		img.setAttribute("src", event.target.result);

		// 썸네일 크기 조절
		img.setAttribute("style", "max-height: 300px;"); // 높이 제한 300px
		img.style.width = "80px"; // 너비 200px로 설정
		img.style.height = "auto"; // 높이 자동 설정
		// 썸네일 리셋 후 미리보기 보여주기
		document.querySelector("div#image_container").innerHTML = "";
		document.querySelector("div#image_container").appendChild(img);
	};
	reader.readAsDataURL(event.target.files[0]);
}

const preview = document.getElementById("file");
preview.addEventListener("change", (event) => {
	setThumbnail(event);
});

const submit = document.getElementById("button");
submit.addEventListener("click", () => {
	handleSignUp();
});
