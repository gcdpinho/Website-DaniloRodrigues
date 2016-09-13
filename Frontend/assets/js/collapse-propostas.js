(function(){
	$(".collapsed").on("click", function(){
		$(".panel-heading").removeClass("bg-blue").find("h4").removeClass("ft-white");
		$(".panel-heading").find(".sprite").removeClass("icon-top").addClass("icon-bottom");
		var $selector = $(this);
		if($selector.attr("aria-expanded") == "true"){
			$selector.find(".sprite").removeClass("icon-top").addClass("icon-bottom");
			$selector.find(".panel-heading").removeClass("bg-blue").find("h4").removeClass("ft-white");
		}
		else {
			$selector.find(".sprite").removeClass("icon-bottom").addClass("icon-top");
			$selector.find(".panel-heading").addClass("bg-blue").find("h4").addClass("ft-white");
		}
	});
}());
