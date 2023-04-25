import {HTTPRequest} from './http_request.js';
import {JsHelper} from './jshelper.js';
import {Slide} from './slide.js';

export class Slider{
	constructor(){
		
		this.slideCount = 0;
		this.currentSlide = -1;
		this.slides=[];
		
		this.parentDiv = new JsHelper()
							.create("div")
							.style('width','100%')
							.style('height','100%');
	}
	presentFile(filename){
		let reader = new FileReader();
        reader.onload = (event)=>{
			let slideShowJson = JSON.parse(event.target.result);
			this.load(slideShowJson);
			this.setStyle();
			this.next();
		};
		reader.readAsText(filename);
		
		return this.parentDiv.get();
	}
	presentURL(slideShowUrl){
		// Show first slide
		new HTTPRequest()
			.setMethod("GET")
			.setApi(slideShowUrl)
			.onSuccess((slideShowJson)=>{
				this.load(slideShowJson);
				this.setStyle();
				this.next();
			})
			.call();
		
		return this.parentDiv.get();
	}
	load(slideShowJson){
		this.name = slideShowJson.name;
		this.author = slideShowJson.author;
		this.copyright = slideShowJson.copyright;
		this.owner = slideShowJson.owner;
		this.date = slideShowJson.date;
		this.cssFile = slideShowJson.cssFile;
		this.backgroundColor = slideShowJson.backgroundColor||'transparent';
		this.backgroundImage = slideShowJson.backgroundImage ? `url(${slideShowJson.backgroundImage})` : 'none';
		this.style = slideShowJson.style||{};
		this.slideCount = slideShowJson.slides.length;
		slideShowJson.slides.map((slideJson)=>{
			this.slides.push(new Slide(slideJson));
		});
	}
	setStyle(){
		this.parentDiv.styleClass(
				{
					'background-color': this.backgroundColor,
					'background-image': this.backgroundImage
				}
		);
		this.parentDiv.styleClass(this.style);
	}
	showSlide(slideNumber){
		let slide = this.slides[slideNumber];
		
		// render the slide
		this.parentDiv.swap(slide.render());
		// start timing functions if any
		if(slide.showDuration){
			this.timer = setTimeout(()=>{this.next();},Number(slide.showDuration));
		}
	}
	removeSlide(slideNumber,callback){
		let slide = this.slides[slideNumber];
		if(slide){
			//Clearout any existing timers, if any
			if(this.timer){
				clearTimeout(this.timer);
			}
			slide.unrender(callback);
		}
		else{
			callback();
		}
	}
	next(){
		// if we are in last slide, return.
		if(this.currentSlide===this.slideCount-1) return;
		
		// Show next slide
		
		this.removeSlide(
				this.currentSlide,
				// function that adds next slide once the current slide removed.
				()=>{
					// Choose next slide
					this.currentSlide = Math.min(this.slideCount-1, this.currentSlide+1);
					// Render next slide
					this.showSlide(this.currentSlide);
				}
			);
		return !(this.currentSlide===this.slideCount-1);
	}
	previous(){
		// if we are in first slide, return.
		if(this.currentSlide===0) return;
		
		// Show previous slide
		
		this.removeSlide(
				this.currentSlide,
				()=>{
					// Choose next slide
					this.currentSlide = Math.max(0, this.currentSlide-1);
					// Render next slide
					this.showSlide(this.currentSlide);
				}
			);
		
		return !(this.currentSlide===0);
	}
}