(function(){
	$(".collapsed").on("click", function(){
		$(".panel-heading").removeClass("bg-grey").children("h4").removeClass("ft-white").parent().children(".sprite").removeClass("open").addClass("close-clp");
		var $selector = $(this);
		if($selector.attr("aria-expanded") == "true"){ 
			$selector.find(".sprite").removeClass("open").addClass("close-clp");
			$selector.find(".panel-heading").removeClass("bg-grey").children("h4").removeClass("ft-white");
		}
		else {
			$selector.find(".sprite").removeClass("close-clp").addClass("open");
			$selector.find(".panel-heading").addClass("bg-grey").children("h4").addClass("ft-white");	
		}
	});
}());