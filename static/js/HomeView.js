var HomeView = (function() {
	var tpl = "home.html"
	var load_timeout;
	var check_timeout;

	function roomEnterCb(data) {
		BaseUI.done();
		if(data['status'] == 200) {
			alert("Yeah it exists!");
		} else {
			ViewController.load(CreateView, {"name": $("input[name=room]").val()})
		}
	}
	
	function onLoad(pass) {
		$("input[name=finish]").bind("click", roomEnter);
		$("input[name=room]").keypress(roomCheck);
		$("a.option").bind("click", BaseUI.optionSelect);
	}
	// Called after clicking "enter" on the room select form
	function roomEnter(e) {
		var errors = false;
		// Make sure they have everything set
		if($("input[name=room]").val() == "") {
			$("input[name=room]").effect("highlight", { color: "#FF0000" });
			errors = true;
		}
		if($("input[name=color]").val() == "" || $("input[name=color]").length == 0) {
			$(".selector").effect("highlight", { color: "#FF0000" });
			errors = true;
		}

		if(errors == true) {
			return
		}

		BaseUI.loading();
		SyncServer.get(
			"game/exists", 
			{ name: $("input[name=room]").val() },
			roomEnterCb
		);
	}

	// Called on every keypress in the room name box
	function roomCheck() {
		clearInterval(check_timeout);
		check_timeout = setTimeout(function() {
			SyncServer.get(
				"game/exists",
				{ name: $("input[name=room]").val() },
				roomCheckCb
			);
		}, 500);
	}

	function roomCheckCb(data) {
		if(data['status'] == 200) {
			$("input[name=finish]").removeClass("red").val("enter");
		} else {
			$("input[name=finish]").addClass("red").val("create room");
		}
	}

	// Release public methods/vars
	return {
		"tpl": tpl,
		"onLoad": onLoad,
	};
})();
