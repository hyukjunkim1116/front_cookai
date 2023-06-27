// 유저 게시글 목록 UI
var query =``
async function articleListView(page=1) {
	const response= await getArticleList(query,page)
	const response_json=await response.json()

	const list_div = document.getElementById("")
	list_div.innerHTML = "";
	const newCardBox = document.createElement("div");
	newCardBox.setAttribute("class", "card-box");
	for (const article of response_json.result) {
        // 새로운 div 요소를 생성하고, class 속성을 "card"로 설정합니다.
        // 또한, 클릭 이벤트 핸들러와 id 속성을 게시물의 고유 식별자(pk)로 설정합니다.
        // 이렇게 생성한 카드를 newCardBox에 추가합니다.
		const newCard = document.createElement("div");
		newCard.setAttribute("class", "card");
		newCard.setAttribute("onclick", `articleDetail(${article.pk})`);
		newCard.setAttribute("id", article.pk);
		newCardBox.appendChild(newCard);

        // 게시물의 대표 이미지를 생성하고, 생성한 이미지를 카드에 추가합니다.
        // 게시물의 photos 배열에서 첫 번째 요소의 file 속성을 가져와서 이미지의 src 속성으로 설정합니다.
        // articlePhoto가 존재하지 않는다면, 기본 이미지 주소를 src 속성으로 설정합니다.
        // 이미지 클릭 이벤트 핸들러를 uploadPhoto 함수로 설정합니다.
		const articlePhoto = article.photos[0]?.file;
		const articleImage = document.createElement("img");
		articleImage.setAttribute("class", "card-img-top");
		if (articlePhoto) {
			articleImage.setAttribute("src", `${articlePhoto}`);
		} else {
			articleImage.setAttribute(
				"src",
				"https://cdn11.bigcommerce.com/s-1812kprzl2/images/stencil/original/products/426/5082/no-image__12882.1665668288.jpg?c=2"
			);
		}
		articleImage.setAttribute("onclick", `uploadPhoto(${article.pk})`);
		newCard.appendChild(articleImage);

        // 카드의 본문 생성.
		const newCardBody = document.createElement("div");
		newCardBody.setAttribute("class", "card-body");

		newCard.appendChild(newCardBody);

        // 카드의 제목 생성. 
		const newCardTitle = document.createElement("h6");
		newCardTitle.setAttribute("class", "card-title");
		const newStrong = document.createElement("strong");
		if (article.title.length > 10) {
			newStrong.innerText = `${article.title.substr(0, 10)} ···`;
		} else {
			newStrong.innerText = article.title;
		}
		newCardTitle.appendChild(newStrong);
		newCardBody.appendChild(newCardTitle);
        
        // 카드에 생성일을 표시하는 요소를 생성.
		const newCardtime = document.createElement("p");
		newCardtime.setAttribute("class", "card-text");
		newCardtime.innerText = article.created_at;
		newCardBody.appendChild(newCardtime);

		list_div.appendChild(newCardBox);
	};
}

// 페이지 로드 시 게시글을 가져오도록 호출합니다
window.onload = async function () {
	articleListView();
}

// 상세 게시글로 이동하는 함수입니다.
function redirectToArticlePage(articleId) {
const url = `http://127.0.0.1:8000/articles/?article_id=${articleId}`;
window.location.href = url;
}
async function getQuery(){
	// 1. 검색타입, 2. 검색자, 3. 카테고리선별 4. 순서

}