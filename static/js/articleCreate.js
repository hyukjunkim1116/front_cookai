const frontend_base_url = "http://127.0.0.1:5500";
const backend_base_url = "http://127.0.0.1:8000";

// 요청 보낼 파일들을 먼저 정의
// 파일들을 모아 적절한 url로 요청 보내기
// 서버에서 받은 응답에 따라 적절히 조절하기

async function postArticle() {
    // document.getElementById() 메서드를 사용하여 HTML 문서의 다양한 요소에 대한 참조를 검색하고 저장하는 것으로 시작합니다.
	const updateBtn = document.getElementById("submit-btn");
	// 코드는 ID가 "submit-btn"인 단추의 텍스트 내용을 빈 문자열로 설정하여 수정합니다.
	updateBtn.innerText = "";
	const span = document.createElement("span");
	span.setAttribute("id", "spinner-span");
	span.setAttribute("class", "spinner-border spinner-border-sm");
	span.setAttribute("role", "status");
	span.setAttribute("aria-hidden", "true");
	// 이것은 <span> 요소를 생성하고 스팬에 대한 다양한 속성을 설정한 후 앞에서 언급한 버튼에 추가합니다. 
	// 이 스팬 요소는 로드 스피너를 나타냅니다.
    const token = localStorage.getItem("access");
    const title = document.getElementById("article_title").value;
	const content = document.getElementById("article_content").value;
	const file = document.getElementById("file").files[0];

    const formdata = new FormData();
    formdata.append("title", title);
    formdata.append("content", content);

    const response = await fetch(`${backend_base_url}/articles/`, {
		headers: {
			Authorization: `Bearer ${token}`
		},
		body: formdata,
		method: "POST"
	});
	// 코드는 fetch() 함수를 사용하여 백엔드 API 끝점(${backend_base_url}/api/articles/)에 대한 POST 요청을 수행합니다. 
	// 요청 헤더에 액세스 토큰을 포함하고 양식 데이터를 요청 본문으로 전송합니다.
	const responseData = await response.json();

    if (file) {
		const responseURL = await fetch(
			`${backend_base_url}/articles/get-url/`,
			{
				method: "POST"
			}
		);
		const dataURL = await responseURL.json();
		// ID "file"인 파일을 선택하면 코드는 다른 API 끝점(${backend_base_url}/api/media/photos/get-url/)으로 다른 POST 요청을 보내
		// 파일을 업로드하기 위한 URL을 가져옵니다.

		//실제로 클라우드플레어에 업로드
		const formData = new FormData();
		formData.append("file", file);
		const responseRealURL = await fetch(`${dataURL["uploadURL"]}`, {
			body: formData,
			method: "POST"
		});
		// 응답 URL은 JSON으로 구문 분석되며, 얻은 URL을 사용하여 클라우드 서비스(예: Cloudflare)에 파일 업로드 요청이 이루어집니다.
		const results = await responseRealURL.json();
		const realFileURL = results.result.variants[0];
		// 클라우드 서비스의 응답은 JSON으로 구문 분석되며 업로드된 파일의 URL이 추출됩니다.
		// 아티클 사진 백엔드로 업로드
		const responseUpload = await fetch(
			`${backend_base_url}/api/articles/${responseData.id}/photos/`,
			{
				headers: {
					// "X-CSRFToken": Cookie.get("csrftoken") || "",
					Authorization: `Bearer ${token}`,
					"content-type": "application/json"
				},
				body: JSON.stringify({
					file: realFileURL
				}),
				method: "POST"
			}
		);
	}
	if (response.status === 200) {
		alert("작성 완료!");
		window.location.replace(
			`${frontend_base_url}/articles/article_detail.html?article_id=${responseData.id}`
		);
	} else {
		alert("작성 실패!");
		window.location.replace(`${frontend_base_url}/`);
	}
}


window.onload = async function () {
	checkNotLogin(); // 로그인 한 사용자만 게시글 작성 가능
	forceLogout();  // 로그아웃은 안 했지만 토큰이 만료된 경우 강제 로그아웃
}
