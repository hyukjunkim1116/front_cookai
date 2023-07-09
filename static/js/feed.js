async function renderList(recommendType, response_json) {
	const newCardBox = document.getElementById(`list_${recommendType}`);
	for (const article of response_json) {
		// 새로운 div 요소를 생성하고, class 속성을 "card"로 설정합니다.
		// 또한, 클릭 이벤트 핸들러와 id 속성을 게시물의 고유 식별자(pk)로 설정합니다.
		// 이렇게 생성한 카드를 newCardBox에 추가합니다.
		const newCard = document.createElement("div");
		newCard.setAttribute("class", "card");
		newCard.setAttribute("style", "height:22rem;");
		newCard.setAttribute(
			"onclick",
			`location.href="${FRONT_BASE_URL}/articles/article_detail.html?article_id=${article.id}"`
		);
		newCard.setAttribute("id", article.id);

		// 게시물의 대표 이미지를 생성하고, 생성한 이미지를 카드에 추가합니다.
		// 게시물의 photos 배열에서 첫 번째 요소의 file 속성을 가져와서 이미지의 src 속성으로 설정합니다.
		// articlePhoto가 존재하지 않는다면, 기본 이미지 주소를 src 속성으로 설정합니다.
		const articleimage = document.createElement("div");
		articleimage.setAttribute("class", "article-image_wide w-100 h-50");

		if (article.image) {
			articleimage.setAttribute(
				"style",
				`background-image:url("${article.image}");`
			);
		} else {
			articleimage.setAttribute(
				"style",
				`background-image:url("https://cdn11.bigcommerce.com/s-1812kprzl2/images/stencil/original/products/426/5082/no-image__12882.1665668288.jpg?c=2");`
			);
		}
		newCard.appendChild(articleimage);

		// 카드의 본문 생성.
		const newCardBody = document.createElement("div");
		newCardBody.setAttribute("class", "card-body article-container_col");

		// 카드의 제목 생성.
		const newCardTitle = document.createElement("div");
		newCardTitle.setAttribute(
			"class",
			"article-content__title_col fs-6 text-truncate w-100"
		);
		newCardTitle.innerText = article.title;
		newCardBody.appendChild(newCardTitle);

		// 카드에 생성일을 표시하는 요소를 생성.

		const newCardAuthor = document.createElement("div");
		newCardAuthor.setAttribute("class", "article-content__user text-truncate");
		newCardAuthor.innerText = article.user;
		// if(article.user.length>10){
		//     newCardAuthor.innerText = article.user.substr(0,9)+"···";
		// }
		newCardBody.appendChild(newCardAuthor);
		const newCardCounts = `<div id="article-content-count" class="article-content-count">
		<div id="article-content__likes_count" class="article-content__likes_count"><i class="bi bi-heart-fill"></i> ${article.likes_count}</div>
		<div id="article-content__comments_count" class="article-content__comments_count">댓글 수: ${article.comments_count}</div>
	</div>`;
		newCardBody.innerHTML += newCardCounts;
		const newCardtime = document.createElement("small");
		newCardtime.setAttribute("class", "article-content__comments_count");
		newCardtime.innerText =
			"작성일 " +
			article.created_at.split(".")[0].slice(2, -3).replace("T", " ");
		newCardBody.appendChild(newCardtime);
		newCard.appendChild(newCardBody);
		const col = document.createElement("div");
		col.setAttribute("style", "width:250px;");
		col.appendChild(newCard);
		newCardBox.appendChild(col);
	}
}

async function loadCollavorativeRecommend() {
	if (isLogin()) {
		const response = await getRecommend(0);
		const response_json = await response.json();
		if (response.status == 200) {
			await renderList(0, response_json);
		} else {
			{
				alert("오류. 다시 시도하거나 로그아웃 후 재로그인해주세요!");
			}
		}
	} else {
		const newCardBox = document.getElementById(`list_0`);
		newCardBox.parentElement.previousElementSibling.previousElementSibling.innerText =
			"추천 피드";
		newCardBox.parentElement.previousElementSibling.innerText =
			"추천 목록입니다. 당신만을 위한 추천목록은 로그인하셔야 이용가능합니다!";
		const buttonBox = document.createElement("div");
		buttonBox.setAttribute("class", "col d-flex flex-column p-4");
		const loginBtn = document.createElement("button");
		loginBtn.setAttribute("class", "block btn btn-outline-secondary h-100");
		loginBtn.setAttribute(
			"onclick",
			`location.href="${FRONT_BASE_URL}/login.html"`
		);
		loginBtn.innerText = "로그인";
		buttonBox.appendChild(loginBtn);
		newCardBox.appendChild(buttonBox);
		return 0;
	}
}
async function loadContentRecommend() {
	if (!isLogin()) {
		const newCardBox = document.getElementById(`list_1`);
		newCardBox.parentElement.previousElementSibling.previousElementSibling.remove();
		newCardBox.parentElement.previousElementSibling.remove();
		newCardBox.parentElement.remove();
		return 0;
	}
	const response = await getRecommend(1);
	const response_json = await response.json();
	if (response.status == 200) {
		await renderList(1, response_json);
	} else {
	}
}

async function loadFeedArticles(queryType, page = 1) {
	const typeToText = { 3: "구독해둔 유저의", 2: "북마크 해둔" };
	const newCardBox = document.getElementById(`list_${queryType}`);

	if (isLogin()) {
		const payload = localStorage.getItem("payload");
		const payload_parse = await JSON.parse(payload);
		user_id = payload_parse.user_id;
		const response = await getUserFeedArticles(user_id, queryType, page);
		const response_json = await response.json();
		for (const article of response_json.results) {
			// 새로운 div 요소를 생성하고, class 속성을 "card"로 설정합니다.
			// 또한, 클릭 이벤트 핸들러와 id 속성을 게시물의 고유 식별자(pk)로 설정합니다.
			// 이렇게 생성한 카드를 newCardBox에 추가합니다.
			const tempHtml = `<div id="article-container" class="article-container" onclick="location.href='${FRONT_BASE_URL}/articles/article_detail.html?article_id=${
				article.id
			}'" style="cursor:pointer">
		<div id="article-image" class="article-image_wide" style="background-image: url('${
			[null, undefined].includes(article.image)
				? "https://cdn11.bigcommerce.com/s-1812kprzl2/images/stencil/original/products/426/5082/no-image__12882.1665668288.jpg?c=2/"
				: article.image
		}');"></div>
		<div id="article-content${article.id}" class="article-content">
			<div id="article-content__title" class="article-content__title_wide">${
				article.title.length <= 22
					? article.title
					: article.title.substr(0, 21) + "⋯"
			}</div>
			<div id="article-content__user" class="article-content__user text-truncate">${
				article.user
			}</div>
			<div id="article-content-count" class="article-content-count">
				<div id="article-content__likes_count" class="article-content__likes_count"><i class="bi bi-heart-fill"></i> ${
					article.likes_count
				}</div>
				<div id="article-content__comments_count" class="article-content__comments_count">댓글 수: ${
					article.comments_count
				}</div>
			</div>
		</div>
		</div>`;
			newCardBox.innerHTML += tempHtml;
			const newCardtime = document.createElement("small");
			newCardtime.setAttribute("class", "article-content__comments_count");
			newCardtime.innerText =
				"작성일 " +
				article.created_at.split(".")[0].slice(2, -3).replace("T", " ");
			document
				.getElementById(`article-content${article.id}`)
				.appendChild(newCardtime);
		}

		const formerNextPageBtn = document.getElementById(`nextpage${queryType}`);
		if (formerNextPageBtn) {
			formerNextPageBtn.remove();
		}
		const nextPageBtn = document.createElement("button");
		nextPageBtn.setAttribute("class", "btn btn-outline-success mt-3 col-12");
		nextPageBtn.setAttribute("type", "button");
		nextPageBtn.setAttribute("id", `nextpage${queryType}`);
		if (response_json.next) {
			nextPageBtn.innerText = "+ 더보기";
			nextPageBtn.setAttribute(
				"onclick",
				`loadFeedArticles(${queryType},${page + 1})`
			);
		} else {
			nextPageBtn.setAttribute(
				"class",
				"mt-3 btn btn-outline-secondary col-12"
			);
			nextPageBtn.setAttribute("disabled", "true");
			nextPageBtn.innerText = "더이상 결과가 없습니다.";
		}
		newCardBox.appendChild(nextPageBtn);
		const allTitle = document.querySelectorAll(".article-content__title_wide");
		allTitle.forEach((e) => {
			e.innerText = e.innerHTML;
		});
		const allUser = document.querySelectorAll(".article-content__user");
		allUser.forEach((e) => {
			e.innerText = e.innerHTML;
		});
	} else {
		newCardBox.parentElement.previousElementSibling.innerText = `로그인 하시면 당신이 ${typeToText[queryType]} 글 목록을 보여줍니다`;
		const buttonBox = document.createElement("div");
		buttonBox.setAttribute("class", "col d-flex flex-column p-4");
		const loginBtn = document.createElement("button");
		loginBtn.setAttribute("class", "block btn btn-outline-secondary h-100");
		loginBtn.setAttribute(
			"onclick",
			`location.href="${FRONT_BASE_URL}/login.html"`
		);
		loginBtn.innerText = "로그인";
		buttonBox.appendChild(loginBtn);
		newCardBox.appendChild(buttonBox);
		return 0;
	}
}
async function tabs(id) {
	for (var i = 0; i < 3; i++) {
		if (i == id) {
			document.getElementById(`feedBox${i}`).hidden = false;
		} else {
			document.getElementById(`feedBox${i}`).hidden = true;
		}
	}
}
async function loaderFunction() {
	await tabs(0);
	await loadCollavorativeRecommend();
	await loadContentRecommend();
	await loadFeedArticles(3);
	await loadFeedArticles(2);
}
