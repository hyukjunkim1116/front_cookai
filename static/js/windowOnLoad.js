window.onload = async function (){
	await injectNavbar()
	await injectfooter()
	await loaderFunction()
	if(window.location.pathname.includes("article_update.html")){
		await loaderFunction_()
	}
}