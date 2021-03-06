var GameClient = (function() {
	function test(data) {
		alert(data['hello']);
	}

	function set(data) {
        var exists = true;
        if($("#" + data['coord']).attr("class") == undefined) exists = false;

		Grid.destroy(data['coord']);
		Grid.place(data['coord'], data['tile'], Grid.colors[data['player']]);

        coord = $("#" + data['coord'])
		coord.data("player", data['player']).data("health", data['health']);

        if(parseInt(data['player']) == Grid.pid && parseInt(data['tile']) > 1) {
            coord.addClass("t1");
        }
		Grid.setHealth(data['coord'], parseInt(data['health']));
	}

	function addPlayer(data) {
		BaseUI.notify("A new player has joined");
	}

	function newMessage(data) {
		BaseUI.newMessage(Grid.colors[data['pid']], data['text']);
	}

	function setCash(data) {
		GameView.setCash(data['cash']);
	}

	function setInc(data) {
		GameView.setIncome(data['inc']);
	}

	function del(data) {
		Grid.destroy(data['coord'])
	}

	function setTerritory(data) {
		GameView.setTerritory(data['tused'], data['tlim']);
	}

	function setHealth(data) {
		Grid.setHealth(data['coord'], data['health']);
		Grid.pingHealth(data['coord']);
	}

    function newGrid(data) {
        $("#loading_list").hide();
        $("<tr><td>"+ data['name'] +"</td><td>"+ data['players'] +" players</td></tr>").appendTo(".gridlist").data("gid", data['gid']).data("size", data['size']);
        HomeView.setupList();
    }

	return {
		"test": test,
	 	"set": set,
	 	"addPlayer": addPlayer,
		"newMessage": newMessage,
		"setCash": setCash,
		"setInc": setInc,
		"del": del,
		"setTerritory": setTerritory,
		"setHealth": setHealth,
        "newGrid": newGrid
	}
})();
