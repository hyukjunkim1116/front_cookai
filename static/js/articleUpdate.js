//아티클 업데이트 하기

let originTargets = [];
let updateOrDelete = {};
let idToIndex = {};
const urlParams = new URLSearchParams(window.location.search);
const articleId = urlParams.get("article_id");
let lastOriginIngredientIndex = 0;
async function generateUpdateFormFields(articleData) {
	// 재료 처리
	articleData.recipeingredient_set.forEach((ingredientData) => {
		handleAddIngredient();
		const lastIndex = ingredientNumber - 1;
		document.getElementById(`ingredient-title-${lastIndex}`).value =
			ingredientData.ingredient_id;
		document.getElementById(`ingredient-amount-${lastIndex}`).value =
			ingredientData.ingredient_quantity;
		document.getElementById(`ingredient-unit-${lastIndex}`).value =
			ingredientData.ingredient_unit;
		document.getElementById(`select${lastIndex}`).value =
			ingredientData.ingredient_unit;
		document
			.getElementById(`delete-ingredient-${lastIndex}`)
			.setAttribute(
				"onclick",
				`deleteOnUpdate(${lastIndex},${ingredientData.id},event)`
			);
		updateOrDelete[ingredientData.id] = false;
		idToIndex[ingredientData.id] = lastIndex;
		originTargets += [lastIndex];
	});

	const recipeContainer = document.getElementById("recipe_container");
	const recipeHTML = articleData.recipe;
	recipeContainer.outerHTML = recipeHTML;
	var count = (recipeHTML.match(/recipe-element/g) || []).length;
	recipeNumber += count;

	// 태그 처리
	const tagInput = document.getElementById("article_tag");
	tagInput.value = articleData.tags.join(",");
}

async function loaderFunction_() {
	// 수정창에 기존 내용 보이게
	await checkNotLogin();

	const exist_post = await getArticle(articleId);

	const updateTitle = document.getElementById("article_title");
	updateTitle.value = exist_post.title;

	const updateContent = document.getElementById("article_content");
	updateContent.value = exist_post.content;

	await generateUpdateFormFields(exist_post);
	await setCategory();
	const categories = document.getElementById("category");

	for (var i = 0; i < categories.options.length; i++) {
		var optionValue = categories.options[i].value;
		if (`${exist_post.category}` === optionValue) {
			categories.options[i].selected = true;
			break; // Exit the loop if a match is found
		}
	}

	// 레시피와 재료를 다루기 위한 코드
	const ingredientsContainer = document.getElementById("ingredient_wrapper");
	const recipeContainer = document.getElementById("recipe_container");
	console.log(recipeContainer);
	recipeContainer.querySelectorAll("textarea").forEach((element) => {
		element.innerHTML = `${element.value.replace(/<br>/g, "\n")}`;
	});

	// // 레시피를 처리하기 위한 코드
	// recipeContainer.outerHTML = exist_post.recipe;

	// => {
	//     // 기존 작성한 내용과 새로 작성한 내용을 함께 생성된 필드에 할당하게 함
	//     const newArticleData = {
	//     title: updateTitle.value,
	//     content: updateContent.value,
	//     category: document.getElementById("category").value,
	//     ingredients: Array.from(ingredientsContainer.getElementsByTagName("input")).map(
	//         (input) => input.value
	//     ),
	//     recipe: Array.from(recipeContainer.getElementsByTagName("textarea")).map(
	//         (textarea) => textarea.value
	//     ),
	//     };
	//     await putApiUpdateArticle(articleId, newArticleData);
	// });
	const updateButton = document.getElementById("update_article");
	updateButton.addEventListener("click", (event) => {
		articleUpdate();
		event.preventDefault();
	});
}
// 업데이트 버튼 이벤트 리스너

// // 아티클 사진 삭제
// async function articlePhotoDelete() {
// 	const exist_post = await getArticleDetail(articleId);
// 	if (exist_post.photos[0]) {
// 		const response = await fetch(
// 			`${backend_base_url}/api/medias/photos/${exist_post.photos[0]?.pk}`,
// 			{
// 				method: "DELETE",
// 				headers: {
// 					Authorization: `Bearer ${token}`
// 				}
// 			}
// 		);
// 		if (response.status == 200) {
// 			alert("사진이 삭제되었습니다!");
// 		} else {
// 			alert("사진 삭제 권한이 없습니다.");
// 		}
// 	} else {
// 		alert("등록된 사진이 없습니다!");
// 	}
// 	location.reload();
// }

//아티클 업데이트 페이지 들어가면 실행되는 함수. file input은 설정 불가

async function articleUpdate() {
	const uploadBtn = document.getElementById("update_article");
	uploadBtn.disabled = true;
	const span = document.createElement("span");
	span.setAttribute("id", "spinner-span");
	span.setAttribute("class", "spinner-border spinner-border-sm");
	span.setAttribute("role", "status");
	span.setAttribute("aria-hidden", "true");
	uploadBtn.appendChild(span);
	const alertMsg = await validateInputs();
	if (alertMsg != "") {
		alert(alertMsg);
		uploadBtn.innerHTML = "";
		uploadBtn.innerText = "게시글 수정하기";
		uploadBtn.disabled = false;
		return 0;
	}
	await arrangeRecipeAndUpload();
	await checkTokenExp();
	const token = localStorage.getItem("access");

	// const exist_post = await getArticle(articleId);
	const category = document.getElementById("category").value;
	const title = document.getElementById("article_title").value;
	const content = document.getElementById("article_content").value;
	const file = document.getElementById("article_image").files[0];

	var formdata = {};
	formdata["title"] = title;
	formdata["content"] = content;
	formdata["category"] = category;

	if (file) {
		const responseURL = await fetch(`${BACKEND_BASE_URL}/articles/get-url/`, {
			method: "POST"
		});
		const dataURL = await responseURL.json();

		//실제로 클라우드플레어에 업로드
		const formData = new FormData();
		formData.append("file", file);
		const responseRealURL = await fetch(`${dataURL["uploadURL"]}`, {
			body: formData,
			method: "POST"
		});
		const results = await responseRealURL.json();
		const realFileURL = results.result.variants[0];
		formdata["image"] = realFileURL;
	}
	//재료 수정 및 삭제 및 새로 작성 여부
	const updateOrDelete_ = Object.entries(updateOrDelete);
	updateOrDelete_.forEach(async (kv) => {
		if (kv[1]) {
			// 삭제 절차
			const ingredientPutResponse = await fetch(
				`${BACKEND_BASE_URL}/articles/recipeingredient/${kv[0]}/`,
				{
					headers: await getHeader((json = false)),
					method: "DELETE"
				}
			);
			if (ingredientPutResponse.status != 204) {
				alert("에러 발생! 다시 시도하시거나 재로그인 해주세요.");
				uploadBtn.innerHTML = "";
				uploadBtn.innerText = "게시글 수정하기";
				uploadBtn.disabled = false;
			}
		} else {
			//수정 절차
			let index = idToIndex[kv[0]];
			const ingredientPutResponse = await fetch(
				`${BACKEND_BASE_URL}/articles/recipeingredient/${kv[0]}/`,
				{
					headers: await getHeader(),
					body: JSON.stringify({
						ingredient: document.getElementById(`ingredient-title-${index}`)
							.value,
						ingredient_quantity: document.getElementById(
							`ingredient-amount-${index}`
						).value,
						ingredient_unit: document.getElementById(`ingredient-unit-${index}`)
							.value
					}),
					method: "PUT"
				}
			);
			if (ingredientPutResponse.status == 200) {
			} else {
				alert("에러 발생! 다시 시도하시거나 재로그인 해주세요.");
				uploadBtn.innerHTML = "";
				uploadBtn.innerText = "게시글 수정하기";
				uploadBtn.disabled = false;
			}
		}
	});
	// 새 재료 추가 절차
	for (var j = 1; j <= ingredientNumber; j++) {
		if (!originTargets.includes(j)) {
			const title = document.getElementById(`ingredient-title-${j}`);
			if (!title) continue;
			let ingredientTitle = title.value;
			let ingredientQuantity = document.getElementById(
				`ingredient-amount-${j}`
			).value;
			let ingredientUnit = document.getElementById(
				`ingredient-unit-${j}`
			).value;
			const ingredientResponse = await fetch(
				`${BACKEND_BASE_URL}/articles/${articleId}/recipeingredient/`,
				{
					headers: await getHeader(),
					body: JSON.stringify({
						ingredient: ingredientTitle,
						ingredient_quantity: ingredientQuantity,
						ingredient_unit: ingredientUnit
					}),
					method: "POST"
				}
			);
			if (ingredientResponse.status == 200) {
			} else {
				alert("에러 발생! 다시 시도하시거나 재로그인 해주세요.");
				uploadBtn.innerHTML = "";
				uploadBtn.innerText = "게시글 수정하기";
				uploadBtn.disabled = false;
			}
		}
	}

	//레시피 수정 여부
	var fileInputs = document
		.getElementById("recipe_container")
		.querySelectorAll('input[type="file"]');
	fileInputs.forEach(async (element) => {
		const file = element.files[0];
		if (file) {
			let recipeImage = element.files[0];
			let responseURL = await fetch(`${BACKEND_BASE_URL}/articles/get-url/`, {
				method: "POST"
			});
			let dataURL = await responseURL.json();
			//실제로 클라우드플레어에 업로드
			let formData = new FormData();
			formData.append("file", recipeImage);
			let responseRealURL = await fetch(`${dataURL["uploadURL"]}`, {
				body: formData,
				method: "POST"
			});
			let results = await responseRealURL.json();
			let realFileURL = results.result.variants[0];
			const image = element.nextElementSibling.firstChild;
			image.setAttribute("src", realFileURL);
			let id = image.getAttribute("id").split("-")[1];
			image.setAttribute("id", `recipe-url-${id}`);
		}
	});
	formdata["recipe"] = document.getElementById("recipe_container").outerHTML;
	var tags = document.getElementById("article_tag").value;
	if (tags.trim() !== "") {
		var tagsCleaned = tags
			.trim()
			.replace(/,[\s]*,/g, ",")
			.replace(/^,/g, "")
			.replace(/,$/g, "");

		let tagsList = tagsCleaned.split(",");

		formdata["tags"] = tagsList;
	}

	const response = await fetch(`${BACKEND_BASE_URL}/articles/${articleId}/`, {
		headers: await getHeader(),
		body: JSON.stringify(formdata),
		method: "PUT"
	});
	if (response.status == 200) {
		location.href = `${FRONT_BASE_URL}/articles/article_detail.html?article_id=${articleId}`;
	} else {
		alert("글 수정 실패!");
		uploadBtn.innerHTML = "";
		uploadBtn.innerText = "게시글 수정하기";
		uploadBtn.disabled = false;
	}
}

const deleteOnUpdate = (id, recipeIngredientId, event) => {
	deleteIngredientDiv(id, event);
	updateOrDelete[recipeIngredientId] = true;
	event.preventDefault();
};
