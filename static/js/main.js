
function loadGTP() {
    var api = $('div.alphaTab').alphaTab({

    loadCallback: function(song) {
            api.jPlayer({ audioTracks: Songsterr.audios, defaultTrack: Songsterr.defaultTrack - 1, song: song });
            $("#loading").hide();
        }
    });

    api.loadFile(Songsterr.gtpUrl);
    localStorage["songId"] = Songsterr.id;
}


$(document).ready(function() {
    var id = 27;
    if (localStorage["songId"]) {
        id = localStorage["songId"];
    }
    $('#mainpanel').css('height', ($(window).height() - 80) + 'px');

    $("#loading").show();
    Songsterr.loadSongInfo(id, loadGTP);

    $('#searchsong').click(function() {
        $("#loading").show();
        Songsterr.searchSong($('#keyword').val());
    });

    $('#searchartist').click(function() {
        $("#loading").show();
        Songsterr.searchSongByArtist($('#keyword').val());
    });

    $("#search_button").button({
        text: false,
        icons: {
            primary: "ui-icon-search"
        }
    }).click(function() {
        $("#searchpanel").toggle("drop", { direction: 'left' }, 500);
    });

    $("#play_button").button({
        text: false,
        icons: {
            primary: "ui-icon-play"
        }
    })

    $("#pause_button").button({
        text: false,
        icons: {
            primary: "ui-icon-pause"
        }
    })

    $("#stop_button").button({
        text: false,
        icons: {
            primary: "ui-icon-stop"
        }
    })

    $("#mixer_button").button({
        text: false,
        icons: {
            primary: "ui-icon-gear"
        }
    }).click(function() {
        $("#mixerpanel").toggle("drop", { direction: 'right' }, 500);

    });
});
