let slider = new Slider();

document.getElementById("root").replaceChildren(slider.presentURL("../demo_slideshow.slides"));

document.onkeydown = (event)=>{
	let e=event||window.event;
	if (e.key == 'ArrowLeft') {
		slider.previous();
	}
	else if (e.key == 'ArrowRight') {
		slider.next();
	}
};