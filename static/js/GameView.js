var GameView = (function() {
	var tpl = "game.html";
	var gid, pid, uid, view_size, size;
	
	/*
	 * INITIAL LOADING FUNCTIONS/CALLBACKS
	 */
	function onLoad(pass) {
		var x, y, grid, open;

		Grid.gid = pass['gid'];
        Grid.pid = pass['pid'];
		Grid.size = pass['size'];

		// Populate the grid
		grid = $("#grid")
		for(y = 0; y < pass['size']; y++) {
			tr = $("<tr id='"+y+"'></tr>").appendTo(grid)
			for(x = 0; x < pass['size']; x++) {
				$("<td id='"+x+"_"+y+"'>&nbsp;</td>").appendTo(tr)
			}
		}
        
		// Start the client
        AsyncClient.connect(joinGame);

		setupEvents();
		Grid.setupEvents();
	}

	function postFade(pass) {
		view_size = [$("#container").width(), $("#container").height()];
	}

	function setupEvents() {
		$(".menu").click(clickMenu);
		$(".submenu a").on("click",selectType);
        $(".exit").click(exit);

		KeyEvents.setup();
	}

	function joinGame() {
        AsyncClient.send("joinGrid", {
            "gid": Grid.gid,
            "pid": Grid.pid
        }, joinGameCb);
	}

	function joinGameCb(data) {
		if(data['status'] != 200) {
            $.cookie("gid", null);
            $.cookie("pid", null);
            location.reload();
            return;
		}
		Grid.colors = data['colors'];
        Grid.color = data['color'];
		Grid.pid = data['pid'];
		Grid.uid = data['uid'];
		$.cookie("gid", Grid.gid, 1);
		$.cookie("pid", Grid.pid, 1);
		$.cookie("size", Grid.size, 1);
		Grid.load(data['coords']);
		GameView.setCash(data['cash']);
		GameView.setIncome(data['inc']);
		GameView.setTerritory(parseInt(data['tused']), parseInt(data['tlim']));
	}

	/*
	 * GAME INTERFACE FUNCTIONS
	 */
	function panViewport(x, y) {
		var cont;
		cont = $("#container");
		cont.scrollTop(cont.scrollTop() + y);
		cont.scrollLeft(cont.scrollLeft() + x);
	}

	function setViewport(x, y) {
		var cont;
		cont = $("#container");
		cont.scrollTop(y);
		cont.scrollLeft(x);
	}

	function setCash(amt) {
		current = parseInt($("#cash").text());
		if(amt < current) {
			$("#cash").css("color", "#FF0000");
			$("#cash").animate({"color": "#1D1D1D"}, 500);
		} else if(amt > current) {
			$("#cash").css("color", "#00FF00");
			$("#cash").animate({"color": "#1D1D1D"}, 500);
		}
		$("#cash").text(amt);
	}

	function setIncome(val) {
		current = parseInt($("#inc").text());
		if(val < current) {
			$("#inc").css("color", "#FF0000");
			$("#inc").animate({"color": "#1D1D1D"}, 500);
		} else if(val > current) {
			$("#inc").css("color", "#00FF00");
			$("#inc").animate({"color": "#1D1D1D"}, 500);
		}
		$("#inc").text(val);
	}

	function setTerritory(tused, tlim) {
		if(tused > 0) {
			$("#tused").text(tused);
		}
		if(tlim > 0) {
			$("#tlim").text(tlim);
		}
        // Are we over?
        if(parseInt(tused) > parseInt(tlim)) {
            $("#territory").css("color", "#FF0000");
        } else {
            $("#territory").css("color", "");
        }
	}

	function getTerritory() {
		return [parseInt($("#tused").text()), parseInt($("#tlim").text())]
	}

	function getCash() {
		return parseInt($("#cash").text());
	}

	/*
	 * Menu interactions
	 */
    function exit() {
        AsyncClient.send("exit", {}, function() {
            ViewController.load(HomeView);   
            $.cookie("gid", null);
            $.cookie("pid", null);
        });
    }

	function clickMenu(e) {
		var menu;
		menu = $(e.target)
		open = menu.attr("opens");
		$(".menu").fadeOut(50, function() {
			menu.addClass("selected");
			$(".menu.selected, #menu_"+open).fadeIn(50)
		});
		$(menu).off().click(returnMain);
		KeyEvents.setScope(open, returnMain);
	}

	function returnMain() {
		var menu;
		menu = $(".menu.selected");
		deselectType();
		$(".menu.selected, #menu_" + open).fadeOut(50, function() {
			$(menu).off().click(clickMenu);
			menu.removeClass("selected");
			$(".menu").fadeIn(50);
		});
		KeyEvents.clearScope();
	}

	function selectType(e) {
		var places;
		$(e.target).addClass("selected");
		$(".submenu a").off("click", selectType).on("click",deselectType);
		$(".submenu a:not(.selected)").hide();
		places = $(e.target).attr("places");
		Grid.placeMode(places);
		KeyEvents.setScope("place", returnMain);
	}

	function deselectType() {
		$(".submenu a.selected").removeClass("selected");
		$(".submenu a").show();
		$(".submenu a").off("click", deselectType).on("click",selectType);
		Grid.normalMode();
		KeyEvents.setScope("build", returnMain);
	}

	return {
		"tpl": tpl,
		"onLoad": onLoad,
		"postFade": postFade,

		// Variables
		"view_size": view_size,

		// Public methods
		"panViewport": panViewport,
		"setViewport": setViewport,
		"setCash": setCash,
		"getCash": getCash,
		"setIncome": setIncome,
		"setTerritory": setTerritory,
		"getTerritory": getTerritory,
		"clickMenu": clickMenu,
		"selectType": selectType,
		"deselectType": deselectType,
		"returnMain": returnMain
	}
})();
