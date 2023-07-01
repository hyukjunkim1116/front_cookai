window.onload = async function (){
	checkTokenExp();
	await injectNavbar()
	await injectfooter()
	await loaderFunction()
	if(window.location.pathname.includes("article_update.html")){
		await loaderFunction_()
	}
}