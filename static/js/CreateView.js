var CreateView = (function() {
	var tpl = "create.html";
	var color;
	
	function onLoad(pass) {
		$("input[name=room]").val(pass['name']);
		color = pass['color'];
		// Register events
		$("a.option").click(BaseUI.optionSelect);
		$("input[name=create]").click(createGame);
	}

	function createGame() {
		SyncServer.post("game/create", {
			"name": $("input[name=room]").val(),
			"size": $("input[name=size]").val(),
		}, createGameCb);
	}

	function createGameCb(data) {
		if(data['status'] != 200) {
			alert("Error! " + data['status']);
			return;
		}

		ViewController.load(GameView, {
			"gid": data['gid'], 
			"size": $("input[name=size]").val(),
			"color": color
		});
	}

	return {
		"tpl": tpl,
	 	"onLoad": onLoad
	};
})();
