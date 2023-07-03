let articleId
let authorId


async function loadArticle(){
    const response = await getArticleDetail(articleId);
	if (response.status==404){
		location.href=`${FRONT_BASE_URL}/page_not_found.html`
	}
    const user_json = await getLoginUser()
    if(response.status == 200) {
        const response_json = await response.json()

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
		articleAuthor.setAttribute("href",`${FRONT_BASE_URL}/mypage.html?user_id=${response_json.author}`)
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

		if (p != null&& p!=""&& p!=`<div id="recipe_container"></div>`) {
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
			p = p.replace(/<\/div>[\s]*<div class="mb-3/, '</div><hr><div class="mb-3');
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


            let deleteBtn = document.createElement("button")
            deleteBtn.setAttribute("type","button")
            deleteBtn.setAttribute("class","btn btn-outline-danger")
            deleteBtn.setAttribute("onclick",`deleteArticleBtn(${articleId})`)
            deleteBtn.innerText = "삭제"


			buttonArea1.append(updateBtn);
			buttonArea1.append(deleteBtn);
		} else {
			if (user_json == null) {
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


async function loadComments(comment_page=1){
    const response = await getComments(articleId,comment_page);
    if (response == null){
        return null
    }
    const commentList = document.getElementById("commentbox")
    commentList.innerHTML = ``

    response.results.forEach(comment => {
        commentList.innerHTML += `
        <div class="card-text">
        <small><a href="${FRONT_BASE_URL}/mypage.html?user_id=${comment.author}">${comment.user}</a>, ${comment.updated_at.split('.')[0].replace("T"," ").slice(0,-3)}</small></div><div class="card-text">${comment.comment}</div>`
        const payload = localStorage.getItem("payload");
	    if (payload) {
		    const payload_parse = JSON.parse(payload);

            commentList.innerHTML +=`<div class="btn-container">`;

            if (payload_parse.user_id == comment.author){
                commentList.innerHTML +=`
                    <button class="comment-btn btn btn-secondary" id="comment-btn${comment.id}" onclick="updateCommentButton(${comment.id})">수정</button>
                    <button class="comment-btn btn btn-danger" id="comment-btn${comment.id}" onclick="deleteCommentButton(${comment.id})">삭제</button>`;
            }
            commentList.innerHTML +=`
                <button class="bi bi-hand-thumbs-up btn btn-outline-dark" id="comment-like" onclick="commentLikeBtn(${comment.id})"> ${comment.likes_count}</button> 
            </div>`;
        }
        // commentList.innerHTML +=` ${comment.likes_count}👍</div><hr>`
    });
    const pagination = document.createElement("ul")
    pagination.setAttribute("class","pagination")
    pagination.innerHTML = ""
    const pagecount = response.count/50+1
    if (pagecount >= 2){
        for (i=1; i < pagecount; i++){
            const newPageBtn = document.createElement("li")
            newPageBtn.setAttribute("class", "page-item")
            const newPageLink = document.createElement("a")
            newPageLink.setAttribute("class", "page-link")
            newPageLink.setAttribute("onclick", `loadComments(${i})`)
            newPageLink.innerText = i
            newPageBtn.appendChild(newPageLink)
            pagination.appendChild(newPageBtn)
        }
        commentList.append(pagination)
    }
}


async function submitComment(){
    const commentElement = document.getElementById("comment-input")
    const newComment = commentElement.value
    const response = await postComment(articleId, newComment)
    commentElement.value = ""
    const response_json = await response.json()
    if(response.status == 200) {
        loadComments()
    } else {
        alert(response.status)
    }
}


async function updateCommentButton(commentId){
    const comment_content = document.getElementById(`comment-btn${commentId}`).innerText
    const commentElement = document.getElementById("comment-input")
    commentElement.value = comment_content
    
    const submitCommentButton = document.getElementById("submitCommentButton")
    submitCommentButton.innerText = "댓글수정"
    submitCommentButton.setAttribute("onclick",`submitUpdateComment(${commentId})`)
}


async function submitUpdateComment(commentId){
    const commentElement = document.getElementById("comment-input")
    const newComment = commentElement.value
    const response = await updateComment(commentId, newComment)
    commentElement.value = ""
    const response_json = await response.json()
    if(response.status == 200) {
        
        loadComments()
    } else {
        alert(response.status)
    }

    const submitCommentButton = document.getElementById("submitCommentButton")
    submitCommentButton.innerText = "댓글작성"
    submitCommentButton.setAttribute("onclick",`submitComment()`)
}


async function deleteCommentButton(commentId){
    const response = await deleteComment(commentId)

    if(response.status == 204) {
        alert("삭제 완료!")
        loadComments()
    } else {
        alert(response.status)
    }
}

async function commentLikeBtn(commentId){
    const response = await likeComment(commentId)
    const response_json = await response.json()
    if (response.status==200 || response.status==204){
        alert(response_json)
        loadComments()
    }else{
        alert(response.status)
    }
}
async function deleteArticleBtn(articleId){
    const response = await deleteArticle(articleId)
    if (response.status==204){
        location.href=`${FRONT_BASE_URL}/`
    }else{
        alert(response.status)
    }
}
async function loaderFunction() {
	const urlParams = new URLSearchParams(window.location.search);
	articleId = urlParams.get("article_id");

	const token = localStorage.getItem("access");
	fetchMissingIngredients(articleId, token);

	await loadArticle();
	await loadComments(1);
}
