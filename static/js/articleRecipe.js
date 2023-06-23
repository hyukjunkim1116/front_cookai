document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("recipe-form");
    const addStepButton = document.getElementById("add-step");
    const stepsContainer = document.getElementById("steps-container");
  
    let stepNumber = 1;
  
    function handleAddStep() {
      const div = document.createElement("div");
      div.classList.add("mb-3");
      div.innerHTML = `
        <label for="step-${stepNumber}" class="form-label">스텝 ${stepNumber}</label>
        <textarea class="form-control" id="step-${stepNumber}" name="step-${stepNumber}" rows="3"></textarea>
      `;
  
      stepsContainer.appendChild(div);
      stepNumber++;
    }
  
    if (addStepButton) {
      addStepButton.addEventListener("click", handleAddStep);
    }
  
    if (form) {
      form.addEventListener("submit", async function (event) {
        event.preventDefault();
  
        // 폼 데이터를 가져오고 처리합니다.
        const titleInput = document.getElementById("title");
        const titleValue = titleInput.value;
        const steps = Array.from(document.querySelectorAll("[id^='step-']")).map((step) => step.value);
  
        const recipeData = {
          title: titleValue,
          steps: JSON.stringify(steps),
        };
  
        try {
          await submitRecipeAPI(recipeData);
        } catch (error) {
          console.error("API 요청 중 오류가 발생했습니다.", error);
        }
      });
    }
  });

function postArticle() {
    const token = localStorage.getItem("access");
	const title = document.getElementById("article_title").value;
	const content = document.getElementById("article_content").value;
	const image = document.getElementById("image").files[0];

    const formdata = new FormData();
    formdata.append("category", category);
    formdata.append("title", title);
	formdata.append("content", content);
    formdata.append("image", image);
    const request = fetch(`${backend_base_url}/api/articles/`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formdata,
        method: "POST"
    });

}