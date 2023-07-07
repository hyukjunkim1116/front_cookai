let articleId;
let authorId;

async function loadArticle() {
	const response = await getArticleDetail(articleId);
	if (response.status == 404) {
		location.href = `${FRONT_BASE_URL}/page_not_found.html`;
	}
	const user_json = await getLoginUser();
	if (response.status == 200) {
		const response_json = await response.json();

		const articleTitle = document.getElementById("title");
		const articleContent = document.getElementById("content");
		const articleThumbnail = document.getElementById("thumbnail");
		const articleAuthor = document.getElementById("author");
		const articleCategory = document.getElementById("category");
		const articleTags = document.getElementById("tags");
		const articleIngredients = document.getElementById("ingredients");
		const articleIngredientTable = document.getElementById("ingredient_table");
		const articleCreatedAt = document.getElementById("created_at");
		const articleUpdatedAt = document.getElementById("updated_at");
		articleCreatedAt.innerText = `작성일: ${response_json.created_at
			.split(".")[0]
			.replace("T", " ")
			.slice(0, -3)}`;
		articleUpdatedAt.innerText = `수정일: ${response_json.updated_at
			.split(".")[0]
			.replace("T", " ")
			.slice(0, -3)}`;
		articleTitle.innerText = response_json.title;
		articleContent.innerText = response_json.content;
		if (response_json.image != null) {
			articleThumbnail.src = response_json.image;
		} else {
			articleThumbnail.remove();
		}

		articleCategory.innerHTML = `카테고리: <a href="${FRONT_BASE_URL}/articles/article_list.html?category=${response_json.category}"><span class="badge bg-dark">${response_json.categoryname}</span></a>`;
		articleAuthor.innerHTML = `${response_json.user}`;
		articleAuthor.setAttribute(
			"href",
			`${FRONT_BASE_URL}/mypage.html?user_id=${response_json.author}`
		);
		var temp_html = ``;
		response_json.tags.forEach((tag) => {
			temp_html += `<a href="${FRONT_BASE_URL}/articles/article_list.html?search=4&selector=${tag}"><span class="badge bg-secondary">${tag}</span></a>&nbsp;`;
		});
		articleTags.innerHTML = temp_html;
		temp_html = ``;
		response_json.recipeingredient_set.forEach((ingredient) => {
			temp_html += `<tr>
            <td>${ingredient.ingredient_id}</td>
            <td>${ingredient.ingredient_quantity}</td>
            <td>${ingredient.ingredient_unit}</td>
        </tr>`;
		});
		if (temp_html != ``) {
			articleIngredientTable.innerHTML = temp_html;
		} else {
			articleIngredients.remove();
		}
		var p = response_json.recipe;

		if (p != null && p != "" && p != `<div id="recipe_container"></div>`) {
			const articleRecipe = document.getElementById("recipe");
			var p = p.replace(/<textarea[^>]*rows="3">/g, '<p class="col-sm-9">');
			p = p.replace(
				/div class="mb-3"/g,
				'div class="mb-3 row" style="min-height: 120px;"'
			);
			p = p.replace(
				/<label for="recipe-image-[^>]*" class="form-label">이미지<\/label>/g,
				""
			);
			p = p.replace(/<input type="file"[^>]*">/g, "");
			p = p.replace(
				/recipe-image-container"/g,
				'col-sm-3 d-flex justify-content-end recipe-image-container"'
			);
			// p= p.replace(/img src/g,'img class="img-thumbnail" style="max-height: 120px;" src')
			p = p.replace(/<\/textarea>/g, "</p>");
			p = p.replace(
				/<button class="btn btn-primary" id="delete-recipe-div" onclick="deleteRecipeDiv([^>]*)">레시피 삭제하기<\/button>/g,
				""
			);
			p = p.replace(/class="form-label">레시피/g, 'class="form-label">과정');
			p = p.replace(
				/<\/div>[\s]*<div class="mb-3/,
				'</div><hr><div class="mb-3'
			);
			articleRecipe.innerHTML = p;
		} else {
			document.getElementById("recipe_box").remove();
		}
		const buttonArea1 = document.getElementById("buttons1");
		if (response_json.is_author) {
			let updateBtn = document.createElement("a");
			updateBtn.setAttribute("class", "btn btn-outline-secondary");
			updateBtn.setAttribute(
				"href",
				`${FRONT_BASE_URL}/articles/article_update.html?article_id=${articleId}`
			);
			updateBtn.innerText = "수정";

			let deleteBtn = document.createElement("button");
			deleteBtn.setAttribute("type", "button");
			deleteBtn.setAttribute("class", "btn btn-outline-danger");
			deleteBtn.setAttribute("onclick", `deleteArticleBtn(${articleId})`);
			deleteBtn.innerText = "삭제";

			buttonArea1.append(updateBtn);
			buttonArea1.append(deleteBtn);
		} else {
			if (user_json == null) {
				let likeBtn = document.createElement("button");
			likeBtn.setAttribute("type", "button");
			likeBtn.setAttribute("class", "btn btn-outline-warning");
			likeBtn.setAttribute("onclick", `likeArticle(${articleId})`);
			likeBtn.innerHTML = `좋아요 👍${response_json.likes_count}<br><small style="font-size:0.6rem">로그인 후 좋아요를 표시할 수 있습니다.</small>`;
			likeBtn.disabled=true
			buttonArea1.append(likeBtn);
				return;
			}
			let followToggleBtn = document.createElement("button");
			followToggleBtn.setAttribute("type", "button");
			followToggleBtn.setAttribute(
				"onclick",
				`otherUserFollowing(${response_json.author})`
			);
			if (user_json.followings.includes(response_json.author)) {
				followToggleBtn.innerText = "팔로우 취소";
				followToggleBtn.setAttribute("class", "btn btn-outline-danger");
			} else {
				followToggleBtn.innerText = "팔로우 하기";
				followToggleBtn.setAttribute("class", "btn btn-outline-success");
			}
			buttonArea1.append(followToggleBtn);
		}
		let likeBtn = document.createElement("button");
		likeBtn.setAttribute("type", "button");
		if (response_json.like.includes(user_json.id)) {
			likeBtn.setAttribute("class", "btn btn-outline-danger");
			likeBtn.setAttribute("onclick", `likeArticle(${articleId})`);
			likeBtn.innerHTML = `좋아요 취소 👍${response_json.likes_count}`;
		} else {
			likeBtn.setAttribute("class", "btn btn-outline-warning");
			likeBtn.setAttribute("onclick", `likeArticle(${articleId})`);
			likeBtn.innerHTML = `좋아요 표시 👍${response_json.likes_count}`;
		}
		let bookmarkBtn = document.createElement("button");
		bookmarkBtn.setAttribute("type", "button");
		if (response_json.bookmark.includes(user_json.id)) {
			bookmarkBtn.setAttribute("class", "btn btn-outline-dark");
			bookmarkBtn.setAttribute("onclick", `bookmarkArticle(${articleId})`);
			bookmarkBtn.innerHTML = `북마크 취소`;
		} else {
			bookmarkBtn.setAttribute("class", "btn btn-outline-success");
			bookmarkBtn.setAttribute("onclick", `bookmarkArticle(${articleId})`);
			bookmarkBtn.innerHTML = `북마크 하기`;
		}

		buttonArea1.append(likeBtn);
		buttonArea1.append(bookmarkBtn);
	} else {
		alert(response.status);
	}
}

async function loadComments(comment_page = 1) {
	if (!isLogin()) {
		document.getElementById("comment-input").disabled = true;
		document.getElementById("submitCommentButton").innerText = "로그인필요";
	}
	const response = await getComments(articleId, comment_page);
	if (response == null) {
		return null;
	}
	const commentList = document.getElementById("commentbox");
	commentList.innerHTML = ``;

	response.results.forEach((comment) => {
		commentList.innerHTML += `

        <div class="card-text">
        <small><a name="comment-author" href="${FRONT_BASE_URL}/mypage.html?user_id=${
			comment.author
		}">${comment.user}</a>, ${comment.updated_at
			.split(".")[0]
			.replace("T", " ")
			.slice(0, -3)}</small></div><div name="comment-str" class="card-text">${
			comment.comment
		}</div>`;
		const payload = localStorage.getItem("payload");
		if (payload) {
			const payload_parse = JSON.parse(payload);

			commentList.innerHTML += `<div class="btn-container">`;

			if (payload_parse.user_id == comment.author) {
				commentList.innerHTML += `
                    <button class="comment-btn btn btn-sm btn-secondary" id="comment-btn${comment.id}" onclick="updateCommentButton(${comment.id})">수정</button>
                    <button class="comment-btn btn btn-sm btn-danger" id="comment-btn${comment.id}" onclick="deleteCommentButton(${comment.id})">삭제</button>`;
			}
			
		}
		commentList.innerHTML += `
                <button class="bi bi-hand-thumbs-up btn btn-sm btn-outline-dark comment-like-${comment.id} ${Boolean(payload)&&comment.like.includes(JSON.parse(payload).user_id)?"active":""}" id="comment-like" onclick="commentLikeBtn(${comment.id})"${Boolean(payload)?"":"disabled"}> ${comment.likes_count}</button>
            </div>`;
		commentList.innerHTML += `<button class="comment-btn btn btn-sm btn-success" id="recomment-btn${comment.id}" onclick="loadReCommentsToggle(${comment.id})">답글보기</button>
		<button class="comment-btn btn-sm btn btn-warning" id="post-recomment-btn${comment.id}" onclick="postReCommentsToggle(${comment.id})">답글작성</button>`;
		// commentList.innerHTML +=` ${comment.likes_count}👍</div><hr>`
	});

	const pagination = document.createElement("ul");
	pagination.setAttribute("class", "pagination");
	pagination.innerHTML = "";
	const pagecount = response.count / 50 + 1;
	if (pagecount >= 2) {
		for (i = 1; i < pagecount; i++) {
			const newPageBtn = document.createElement("li");
			newPageBtn.setAttribute("class", "page-item");
			const newPageLink = document.createElement("a");
			newPageLink.setAttribute("class", "page-link");
			newPageLink.setAttribute("onclick", `loadComments(${i})`);
			newPageLink.innerText = i;
			newPageBtn.appendChild(newPageLink);
			pagination.appendChild(newPageBtn);
		}
		commentList.append(pagination);
	}
}
async function loadReComments(commentId, recomment_page = 1) {
	const response = await getReComments(articleId, commentId, recomment_page);
	console.log(response);
	if (response == null) {
		return null;
	}

	const recommentList = document.createElement("div");
	response.results.forEach((recomment) => {
		if (document.querySelector(`.recomment-wrapper-${recomment.comment}`)) {
			const prevRecommentList = document.querySelector(
				`.recomment-wrapper-${recomment.comment}`
			);
			prevRecommentList.remove();
		}
		recommentList.className = `recomment-wrapper-${recomment.comment}`;
		recommentList.innerHTML += `
		<div class="card-text">
			<small><a name="comment-author" href="${FRONT_BASE_URL}/mypage.html?user_id=${recomment.author}">${
			recomment.user
		}</a>, ${recomment.updated_at
			.split(".")[0]
			.replace("T", " ")
			.slice(0, -3)}</small>
		</div>
		<div class="card-text" name="comment-str">${recomment.recomment}</div>`;
		const btnContainer = document.createElement("div");
		btnContainer.className = "btn-container";

		const payload = localStorage.getItem("payload");
		if (payload) {
			const payload_parse = JSON.parse(payload);

			if (payload_parse.user_id == recomment.author) {
				btnContainer.innerHTML += `
				<button class="comment-btn btn btn-sm btn-secondary recomment-put-btn${recomment.id}" id="comment-btn${recomment.id}" onclick="updateReCommentButton(${recomment.comment},${recomment.id})">수정</button>
				<button class="comment-btn btn btn-sm btn-danger recomment-put-btn${recomment.id}" id="comment-btn${recomment.id}" onclick="deleteReCommentButton(${recomment.comment},${recomment.id})">삭제</button>`;
			}
		}
		btnContainer.innerHTML += `
		<button class="bi bi-hand-thumbs-up btn btn-sm btn-outline-dark ${Boolean(payload)&&comment.like.includes(JSON.parse(payload).user_id)?"active":""}" id="recomment-like" ${Boolean(payload)?"":"disabled"} onclick="recommentLikeBtn(${recomment.comment},${recomment.id})"> ${recomment.likes_count}</button>`;
		const likeBtn = document.querySelector(
			`.comment-like-${recomment.comment}`
		);
		recommentList.appendChild(btnContainer);
		likeBtn.after(recommentList);
	});
	const pagination = document.createElement("ul");
	pagination.setAttribute("class", "pagination");
	pagination.innerHTML = "";
	const pagecount = response.count / 5 + 1;
	if (pagecount >= 2) {
		for (i = 1; i < pagecount; i++) {
			const newPageBtn = document.createElement("li");
			newPageBtn.setAttribute("class", "page-item");
			const newPageLink = document.createElement("a");
			newPageLink.setAttribute("class", "page-link");
			newPageLink.setAttribute("onclick", `loadReComments(${commentId},${i})`);
			newPageLink.innerText = i;
			newPageBtn.appendChild(newPageLink);
			pagination.appendChild(newPageBtn);
		}
		recommentList.append(pagination);
	}
}
async function submitComment() {
	const commentElement = document.getElementById("comment-input");
	const newComment = commentElement.value;
	checkNotLogin();
	const response = await postComment(articleId, newComment);
	commentElement.value = "";
	const response_json = await response.json();
	if (response.status == 200) {
		loadComments();
	} else if (response.status == 400) {
		alert("빈 내용이거나 올바르지 않은 내용입니다!");
	} else {
		alert("오류. 다시 시도하거나 로그아웃 후 재로그인 해주세요!");
	}
}

async function updateCommentButton(commentId) {
	const comment_content = document.getElementById(
		`comment-btn${commentId}`
	).previousElementSibling.previousElementSibling.innerText;
	const commentElement = document.getElementById("comment-input");
	commentElement.value = comment_content;

	const submitCommentButton = document.getElementById("submitCommentButton");
	submitCommentButton.innerText = "댓글수정";
	submitCommentButton.setAttribute(
		"onclick",
		`submitUpdateComment(${commentId})`
	);
}

async function submitUpdateComment(commentId) {
	const commentElement = document.getElementById("comment-input");
	const newComment = commentElement.value;
	const response = await updateComment(commentId, newComment);
	commentElement.value = "";
	const response_json = await response.json();
	if (response.status == 200) {
		loadComments();
	} else {
		alert(response.status);
	}

	const submitCommentButton = document.getElementById("submitCommentButton");
	submitCommentButton.innerText = "댓글작성";
	submitCommentButton.setAttribute("onclick", `submitComment()`);
}
async function deleteCommentButton(commentId) {
	const response = await deleteComment(commentId);

	if (response.status == 204) {
		alert("삭제 완료!");
		loadComments();
	} else {
		alert(response.status);
	}
}

async function commentLikeBtn(commentId) {
	const response = await likeComment(commentId);
	const response_json = await response.json();
	if (response.status == 200 || response.status == 204) {
		alert(response_json);
		loadComments();
	} else {
		alert(response.status);
	}
}
async function deleteArticleBtn(articleId) {
	const response = await deleteArticle(articleId);
	if (response.status == 204) {
		location.href = `${FRONT_BASE_URL}/`;
	} else {
		alert("오류. 다시 시도하시거나 로그아웃 후 재로그인해주세요!");
	}
}
async function recommentLikeBtn(commentId, recommentId) {
	const response = await likeReComment(recommentId);
	const response_json = await response.json();
	if (response.status == 200 || response.status == 204) {
		alert(response_json);
		const recommentBtn = document.getElementById(`recomment-btn${commentId}`);
		const recommentWrapper = document.querySelectorAll(
			`.recomment-wrapper-${commentId}`
		);
		const clickedClass = "clicked";
		recommentWrapper.forEach((elem) => elem.remove());
		if (recommentBtn.classList.contains(clickedClass)) {
			recommentBtn.classList.remove(clickedClass);
		}
		loadReCommentsToggle(commentId);
	} else {
		alert(response.status);
	}
}
async function submitUpdateReComment(commentId, recommentId) {
	const recommentBtn = document.getElementById(`recomment-btn${commentId}`);
	const recommentElement = document.getElementById("recomment-input");
	recommentElement.value=recommentBtn.previousElementSibling.previousElementSibling.innerText
	const newReComment = recommentElement.value;
	const recommentWrapper = document.querySelectorAll(
		`.recomment-wrapper-${commentId}`
	);
	const clickedClass = "clicked";
	const response = await updateReComment(commentId, recommentId, newReComment);
	recommentElement.value = "";
	const response_json = await response.json();
	if (response.status == 200) {
		alert("수정 완료!");
		recommentWrapper.forEach((elem) => elem.remove());
		if (recommentBtn.classList.contains(clickedClass)) {
			recommentBtn.classList.remove(clickedClass);
		}
		loadReCommentsToggle(commentId);
	} else {
		alert(response.status);
	}

	const submitCommentButton = document.getElementById("submitCommentButton");
	submitCommentButton.innerText = "댓글작성";
	submitCommentButton.setAttribute("onclick", `submitComment()`);
}
async function updateReCommentButton(commentId, recommentId) {
	const recommentContent = document.getElementById(
		`comment-btn${recommentId}`
	).innerText;
	const recommentElement = document.getElementById("recomment-input");
	if (!recommentElement) {
		postReCommentsToggle(commentId);
		const recommentElement = document.getElementById("recomment-input");
		recommentElement.value = recommentContent;
	} else {
		recommentElement.value = recommentContent;
	}

	const submitReCommentButton = document.getElementById(
		"submitReCommentButton"
	);
	submitReCommentButton.innerText = "답글수정";
	submitReCommentButton.setAttribute(
		"onclick",
		`submitUpdateReComment(${commentId},${recommentId})`
	);
}
async function deleteReCommentButton(commentId, recommentId) {
	const recommentBtn = document.getElementById(`recomment-btn${commentId}`);
	const response = await deleteReComment(commentId, recommentId);
	const recommentWrapper = document.querySelectorAll(
		`.recomment-wrapper-${commentId}`
	);
	const clickedClass = "clicked";
	if (response.status == 204) {
		alert("삭제 완료!");
		recommentWrapper.forEach((elem) => elem.remove());
		if (recommentBtn.classList.contains(clickedClass)) {
			recommentBtn.classList.remove(clickedClass);
		}
		loadReCommentsToggle(commentId);
	} else {
		alert(response.status);
	}
}
async function submitReComment(commentId) {
	const recommentBtn = document.getElementById(`recomment-btn${commentId}`);
	const clickedClass = "clicked";
	const recommentElement = document.getElementById("recomment-input");
	const newRecomment = recommentElement.value;
	const response = await postReComment(articleId, commentId, newRecomment);
	const recommentWrapper = document.querySelectorAll(
		`.recomment-wrapper-${commentId}`
	);
	recommentElement.value = "";
	const response_json = await response.json();
	if (response.status == 200) {
		recommentWrapper.forEach((elem) => elem.remove());
		if (recommentBtn.classList.contains(clickedClass)) {
			recommentBtn.classList.remove(clickedClass);
		}
		loadReCommentsToggle(commentId);
	} else {
		alert(response.status);
	}
}
function postReCommentsToggle(commentId) {
	const postRecommentBtn = document.getElementById(
		`post-recomment-btn${commentId}`
	);
	const postRecommentInput = document.createElement("div");
	postRecommentInput.setAttribute(
		"class",
		`container mt-1 recomment-input-div-${commentId}`
	);
	postRecommentInput.innerHTML = `
	<div class="input-group mb-3">
        <input type="text" class="form-control" id="recomment-input" />
        <button class="btn btn-outline-primary" type="button" onclick="submitReComment(${commentId})" id="submitReCommentButton">
        답글작성</button>
    </div>
	`;
	const clickedClass = "clicked";
	if (postRecommentBtn.classList.contains(clickedClass)) {
		const recommentInput = document.querySelector(
			`.recomment-input-div-${commentId}`
		);
		postRecommentBtn.classList.remove(clickedClass);
		postRecommentBtn.innerText = "답글작성";
		recommentInput.remove();
	} else {
		postRecommentBtn.classList.add(clickedClass);
		postRecommentBtn.after(postRecommentInput);
		postRecommentBtn.innerText = "답글작성취소";
	}
}
function loadReCommentsToggle(commentId) {
	const recommentBtn = document.getElementById(`recomment-btn${commentId}`);
	const recommentWrapper = document.querySelectorAll(
		`.recomment-wrapper-${commentId}`
	);
	const clickedClass = "clicked";
	if (recommentBtn.classList.contains(clickedClass)) {
		recommentBtn.classList.remove(clickedClass);
		recommentWrapper.forEach((elem) => elem.remove());
		recommentBtn.innerText = "답글보기";
	} else {
		recommentBtn.classList.add(clickedClass);
		loadReComments(commentId);
		recommentBtn.innerText = "답글닫기";
	}
}

async function loaderFunction() {
	const urlParams = new URLSearchParams(window.location.search);
	articleId = urlParams.get("article_id");
	await loadArticle();
	await loadComments(1);
	await fetchMissingIngredients(articleId);
	const commentAuthors =document.getElementsByName("comment-author")
	for (const commentAuthor of commentAuthors){
		commentAuthor.innerText=commentAuthor.innerHTML
	}
	const commentStrs =document.getElementsByName("comment-str")
	for (const commentStr of commentStrs){
		commentStr.innerText=commentStr.innerHTML
	}
}
