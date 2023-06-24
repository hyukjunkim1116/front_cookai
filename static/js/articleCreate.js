let ingredientNumber = 1;
let recipeNumber = 1;
const setCategory = async () => {
	const categories = await getCategory();
	const select = document.querySelector(".category");
	categories.forEach((category) => {
		const option = document.createElement("option");
		option.setAttribute("value", `${category.id}`);
		option.innerText = `${category.name}`;
		select.appendChild(option);
	});
};
const handleAddIngredient = () => {
	const ingredientContainer = document.getElementById("ingredient_container");

	const div = document.createElement("div");
	div.setAttribute("id", `ingredient-${ingredientNumber}`);
	div.classList.add("mb-3");
	div.innerHTML = `
	<label for="ingredient-title-${ingredientNumber}" class="form-label">재료 제목</label>
	<input type="text" class="form-control" id="ingredient-title-${ingredientNumber}" name="ingredient-title-${ingredientNumber}" placeholder="재료 제목을 입력하세요">
	<label for="ingredient-amount-${ingredientNumber}" class="form-label">수량</label>
	<input type="text" class="form-control" id="ingredient-amount-${ingredientNumber}" name="ingredient-amount-${ingredientNumber}" placeholder="수량을 입력하세요">
	<label for="ingredient-unit-${ingredientNumber}" class="form-label">단위</label>
	<input type="text" class="form-control-${ingredientNumber}" id="ingredient-unit" name="ingredient-unit-${ingredientNumber}" placeholder="단위를 입력하세요">
	<button class="btn btn-primary" id="delete-recipe-image" onclick="deleteIngredientDiv(${ingredientNumber})">재료 삭제하기</button>
	`;

	ingredientContainer.appendChild(div);
	ingredientNumber++;
	console.log(div);
};
const handleAddRecipe = () => {
	const recipeContainer = document.getElementById("recipe_container");

	const div = document.createElement("div");
	div.classList.add("mb-3");
	div.setAttribute("id", `recipe-${recipeNumber}`);
	div.innerHTML = `
	<label for="recipe-${recipeNumber}" class="form-label">레시피 ${recipeNumber}</label>
	<textarea class="form-control" id="recipe-${recipeNumber}" name="recipe-${recipeNumber}" rows="3"></textarea>
	<label for="recipe-image-${recipeNumber}" class="form-label">이미지</label>
	<input type="file" onchange="setRecipeThumbnail(${recipeNumber},event);" class="form-control" id="recipe-image-${recipeNumber}" accept="image/*">
	<div id="recipe-image-${recipeNumber}-container" class="recipe-image-${recipeNumber}-container"></div>
	<button class="btn btn-primary" id="delete-recipe-image" onclick="deleteRecipeDiv(${recipeNumber})">레시피 삭제하기</button>
	`;
	recipeContainer.appendChild(div);
	recipeNumber++;
	console.log(recipeContainer);
};
async function postArticle() {
	// 카테고리는 중간발표 이후에 추가하기.
	const uploadBtn = document.getElementById("submit-article");
	uploadBtn.innerText = "";
	const span = document.createElement("span");
	span.setAttribute("id", "spinner-span");
	span.setAttribute("class", "spinner-border spinner-border-sm");
	span.setAttribute("role", "status");
	span.setAttribute("aria-hidden", "true");
	const token = localStorage.getItem("access");
	const title = document.getElementById("article_title").value;
	const content = document.getElementById("article_content").value;
	const tags = document.getElementById("article_tag").value;
	console.log(tags.split(","));
	const file = document.getElementById("article_image").files[0];
	const recipeContainer = document.getElementById("recipe_container");
	const category = document.getElementById("category");
	const categoryValue = category.options[category.selectedIndex].value;
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
		const response = await fetch(`${BACKEND_BASE_URL}/articles/`, {
			headers: {
				Authorization: `Bearer ${token}`,
				"content-type": "application/json"
			},
			body: JSON.stringify({
				title: title,
				content: content,
				recipe: recipeContainer.outerHTML,
				tags: tags.split(","),
				category: categoryValue,
				file: realFileURL
			}),
			method: "POST"
		});
		if (response.status === 200) {
			alert("작성 완료!");
			// window.location.replace(
			// 	`${frontend_base_url}/articles/article_detail.html?article_id=${responseData.id}`
			// );
		} else {
			alert("작성 실패!");
			// window.location.replace(`${frontend_base_url}/`);
		}
	} else {
		const response = await fetch(`${BACKEND_BASE_URL}/articles/`, {
			headers: {
				Authorization: `Bearer ${token}`,
				"content-type": "application/json"
			},
			body: JSON.stringify({
				title: title,
				content: content,
				recipe: recipeContainer.outerHTML,
				tags: tags.split(","),
				category: categoryValue
			}),
			method: "POST"
		});
		if (response.status === 200) {
			alert("작성 완료!");
			// window.location.replace(
			// 	`${frontend_base_url}/articles/article_detail.html?article_id=${responseData.id}`
			// );
		} else {
			alert("작성 실패!");
			// window.location.replace(`${frontend_base_url}/`);
		}
	}
}
// document.addEventListener("DOMContentLoaded", function () {
// 	const form = document.getElementById("recipe-form");
//

// 	if (addStepButton) {
// 		addStepButton.addEventListener("click", handleAddStep);
// 	}

// 	if (form) {
// 		form.addEventListener("submit", async function (event) {
// 			event.preventDefault();

// 			// 폼 데이터를 가져오고 처리합니다.
// 			const titleInput = document.getElementById("title");
// 			const titleValue = titleInput.value;
// 			const steps = Array.from(document.querySelectorAll("[id^='step-']")).map(
// 				(step) => step.value
// 			);

// 			const recipeData = {
// 				title: titleValue,
// 				steps: JSON.stringify(steps)
// 			};

// 			try {
// 				await submitRecipeAPI(recipeData);
// 			} catch (error) {
// 				console.error("API 요청 중 오류가 발생했습니다.", error);
// 			}
// 		});
// 	}
// });

// function postArticle() {
// 	const token = localStorage.getItem("access");
// 	const title = document.getElementById("article_title").value;
// 	const content = document.getElementById("article_content").value;
// 	const image = document.getElementById("image").files[0];

// 	const formdata = new FormData();
// 	formdata.append("category", category);
// 	formdata.append("title", title);
// 	formdata.append("content", content);
// 	formdata.append("image", image);
// 	const request = fetch(`${BACKEND_BASE_URL}/api/articles/`, {
// 		headers: {
// 			Authorization: `Bearer ${token}`
// 		},
// 		body: formdata,
// 		method: "POST"
// 	});
// }
const addIngredientButton = document.getElementById("add-ingredient");
addIngredientButton.addEventListener("click", () => {
	handleAddIngredient();
});
const addRecipeButton = document.getElementById("add-recipe");
addRecipeButton.addEventListener("click", () => {
	handleAddRecipe();
});
const submitArticleButton = document.getElementById("submit-article");
submitArticleButton.addEventListener("click", (event) => {
	postArticle();
	event.preventDefault();
});
const deleteRecipeDiv = (id, event) => {
	const recipeDiv = document.getElementById(`recipe-${id}`);
	recipeDiv.remove();
	event.preventDefault();
};
const deleteIngredientDiv = (id, event) => {
	const ingredientDiv = document.getElementById(`ingredient-${id}`);
	ingredientDiv.remove();
	event.preventDefault();
};
window.onload = async function () {
	checkNotLogin();
	forceLogout();
	setCategory();
};
